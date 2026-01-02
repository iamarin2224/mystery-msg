'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from '@ai-sdk/react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { aiPromptSchema } from '@/schemas/aiPromptSchema';
import { Input } from '@/components/ui/input';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to sent message');
    } finally {
      setIsLoading(false);
    }
  };

  const promptForm = useForm<z.infer<typeof aiPromptSchema>>({
    resolver: zodResolver(aiPromptSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSuggestionSubmit = async (data: z.infer<typeof aiPromptSchema>) => {
    try {
      await complete(data.prompt);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent} className='cursor-pointer'>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="my-8 space-y-6">
        <Form {...promptForm}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <FormField
                control={promptForm.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block sm:hidden">
                      Theme for suggestions
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type a theme to generate questions (e.g. travel, college life)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={promptForm.handleSubmit(onSuggestionSubmit)}
                disabled={isSuggestLoading}
                className="shrink-0 cursor-pointer"
              >
                {isSuggestLoading ? 'Generating...' : 'Suggest Messages'}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Click on any message below to select it.
            </p>
          </div>
        </Form>

        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold">Messages</h3>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {error ? (
              <p className="text-sm text-destructive">
                Suggestions are temporarily unavailable. Please try again.
              </p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleMessageClick(message)}
                  className="justify-start text-left whitespace-normal h-auto cursor-pointer"
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'} target='blank'>
          <Button className='cursor-pointer'>Create Your Account</Button>
        </Link>
      </div>
      
    </div>
  );
}