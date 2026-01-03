"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import messages from "@/data/messages.json"
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white" >

        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Mysterious and Annonymous Messages
          </h1>
          <Link href="/sign-up">
            <Button
              variant="outline"
              className="h-8 p-5 my-8 md:my-12 text-lg bg-slate-100 text-black"
            >
              Create Your Account
            </Button>
          </Link>
          <p className="text-base md:text-lg">
            Mystery Message - Where your identity remains a secret.
          </p>
        </section>

        <Carousel 
          plugins={[Autoplay({delay: 2500})]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-2xl font-semibold mx-4">{message.content}</span>
                    </CardContent>
                    <CardFooter>
                      {message.received}
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      </main>
    </>
  );
}
