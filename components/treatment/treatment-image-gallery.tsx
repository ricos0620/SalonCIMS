"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TreatmentImageGalleryProps {
  images: string[]
  treatmentType: string
}

export function TreatmentImageGallery({ images, treatmentType }: TreatmentImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <Image src="/placeholder.svg" alt="施術画像なし" width={200} height={150} className="opacity-50" />
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer group">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${treatmentType} - 画像 ${currentIndex + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {images.length > 1 && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  クリックで拡大表示
                </p>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${treatmentType} - 画像 ${currentIndex + 1}`}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                index === currentIndex ? "border-primary" : "border-gray-200"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`サムネイル ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

