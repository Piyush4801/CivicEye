'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Sparkles, Loader2, UploadCloud, Mic } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

const issueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please describe the issue in more detail'),
  category: z.string().min(1, 'Category is required'),
});

export function RaiseIssueForm() {
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<{ address: string, coordinates: number[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ suggestedAction: string; severity: string; confidence: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListeningTitle, setIsListeningTitle] = useState(false);
  const [isListeningDescription, setIsListeningDescription] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof issueSchema>>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
    },
  });

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const address = data.display_name || `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`;
          setLocation({
            address,
            coordinates: [longitude, latitude] // GeoJSON format [lng, lat]
          });
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          setLocation({
            address: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
            coordinates: [longitude, latitude]
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert('Failed to get location. Please allow location permissions.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const startListening = (field: 'title' | 'description') => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support voice input. Please try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (field === 'title') setIsListeningTitle(true);
    else setIsListeningDescription(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const currentVal = form.getValues(field) || '';
      form.setValue(field, currentVal ? `${currentVal} ${transcript}` : transcript);
      if (field === 'title') setIsListeningTitle(false);
      else setIsListeningDescription(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please allow microphone access to use voice input.');
      }
      if (field === 'title') setIsListeningTitle(false);
      else setIsListeningDescription(false);
    };

    recognition.onend = () => {
      if (field === 'title') setIsListeningTitle(false);
      else setIsListeningDescription(false);
    };

    recognition.start();
  };

  const handleAiAnalysis = () => {
    const values = form.getValues();
    if (!values.description) return alert('Please enter a description first for AI to analyze.');

    setIsAnalyzing(true);
    // Mock Gemini API call
    setTimeout(() => {
      setAiAnalysis({
        suggestedAction: 'Forward to Public Works Department for immediate inspection.',
        severity: 'High',
        confidence: 94,
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const onSubmit = async (data: z.infer<typeof issueSchema>) => {
    if (!location) return alert('Please detect your GPS location first');

    setIsSubmitting(true);
    try {
      await api.post('/issues', {
        ...data,
        location,
        images: previewImage ? [previewImage] : []
      });
      alert('Issue reported successfully!');
      router.push('/dashboard/citizen');
    } catch (error) {
      console.error(error);
      alert('Failed to submit issue. Are you logged in?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

      {/* AI Analysis Result */}
      {aiAnalysis && (
        <Alert className="bg-primary/5 border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-semibold">AI Analysis Complete ({aiAnalysis.confidence}% confidence)</AlertTitle>
          <AlertDescription className="text-sm mt-2">
            <p><strong>Predicted Severity:</strong> {aiAnalysis.severity}</p>
            <p><strong>Suggested Route:</strong> {aiAnalysis.suggestedAction}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Media Upload */}
      <div className="space-y-2">
        <Label>Photo / Video Evidence</Label>
        <div
          className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
          {previewImage ? (
            <>
              <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button type="button" variant="secondary" size="sm" className="gap-2">
                  <UploadCloud className="h-4 w-4" /> Change Image
                </Button>
              </div>
            </>
          ) : (
            <>
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG or MP4 (max. 10MB)</p>
              <Button type="button" variant="outline" size="sm" className="mt-4 gap-2">
                <Camera className="h-4 w-4" /> Take Photo
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <div className="flex gap-2">
          <Input
            readOnly
            placeholder="No location selected"
            value={location?.address || ''}
            className="bg-muted"
          />
          <Button type="button" variant="secondary" onClick={handleGetLocation} disabled={isLocating}>
            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            <span className="ml-2 sr-only md:not-sr-only">{isLocating ? 'Locating...' : 'Detect GPS'}</span>
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Issue Title</Label>
        <div className="relative">
          <Input id="title" placeholder="e.g. Deep pothole on Main Street" className="pr-10" {...form.register('title')} />
          <button
            type="button"
            onClick={() => startListening('title')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors z-10 p-1"
            title="Use Voice Input"
          >
            <Mic className={`h-4 w-4 ${isListeningTitle ? 'text-red-500 animate-pulse' : ''}`} />
          </button>
        </div>
        {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select onValueChange={(value: string | null) => { if (value) form.setValue('category', value) }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pothole">Potholes / Damaged Road</SelectItem>
            <SelectItem value="garbage">Garbage / Illegal Dumping</SelectItem>
            <SelectItem value="water">Water Leakage / Drainage</SelectItem>
            <SelectItem value="light">Broken Streetlights</SelectItem>
            <SelectItem value="safety">Public Safety</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.category && <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Detailed Description</Label>
        <div className="relative">
          <Textarea
            id="description"
            placeholder="Describe the issue, landmarks nearby, and how long it has been there..."
            className="min-h-[120px] pr-10"
            {...form.register('description')}
          />
          <button
            type="button"
            onClick={() => startListening('description')}
            className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors z-10 p-1"
            title="Use Voice Input"
          >
            <Mic className={`h-4 w-4 ${isListeningDescription ? 'text-red-500 animate-pulse' : ''}`} />
          </button>
        </div>
        {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
      </div>

      {/* AI Analysis Trigger */}
      <div className="flex justify-end pt-2 pb-4 border-b">
        <Button
          type="button"
          variant="outline"
          onClick={handleAiAnalysis}
          disabled={isAnalyzing}
          className="gap-2 text-primary border-primary/30 hover:bg-primary/10"
        >
          {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isAnalyzing ? 'Analyzing with AI...' : 'Analyze with Gemini AI'}
        </Button>
      </div>

      <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Submit Report
      </Button>
    </form>
  );
}
