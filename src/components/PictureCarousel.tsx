import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import type { BuildingPictureResponse } from "../types/api";

interface CarouselProps {
  pictures: BuildingPictureResponse[];
  name: string;
}

export function PictureCarousel({ pictures, name }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? pictures.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === pictures.length - 1 ? 0 : c + 1));

  if (pictures.length === 0) {
    return (
      <div className="w-full aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 group">
      {pictures.map((pic, i) => (
        <img
          key={pic.id}
          src={pic.data ? `data:${pic.contentType};base64,${pic.data}` : undefined}
          alt={`${name} — photo ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {pictures.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {pictures.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-white w-5" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            {current + 1} / {pictures.length}
          </div>
        </>
      )}
    </div>
  );
}