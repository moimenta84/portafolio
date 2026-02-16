// components/VideoSlider/VideoSlider.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

const VideoSlider = () => {

  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const predefinedVideos = [
        {
          id: "SqcY0GlETPk",
          title: "React Tutorial for Beginners",
          thumbnail: "https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg",
          channelTitle: "Programming with Mosh",
          publishedAt: "2023",
        },
        {
          id: "W6NZfCO5SIk",
          title: "JavaScript Tutorial Full Course",
          thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
          channelTitle: "freeCodeCamp",
          publishedAt: "2023",
        },
        {
          id: "fYq5PXgSsbE",
          title: "Git and GitHub for Beginners",
          thumbnail: "https://img.youtube.com/vi/fYq5PXgSsbE/maxresdefault.jpg",
          channelTitle: "Kevin Stratvert",
          publishedAt: "2023",
        },
        {
          id: "RGOj5yH7evk",
          title: "Git and GitHub for Beginners - Crash Course",
          thumbnail: "https://img.youtube.com/vi/RGOj5yH7evk/maxresdefault.jpg",
          channelTitle: "freeCodeCamp",
          publishedAt: "2023",
        },
        {
          id: "Oe421EPjeBE",
          title: "100+ Web Development Things you Should Know",
          thumbnail: "https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg",
          channelTitle: "Fireship",
          publishedAt: "2023",
        },
      ];

      setVideos(predefinedVideos);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
      useEffect(() => {
    fetchVideos();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-white/10 backdrop-blur-sm rounded-2xl animate-pulse flex items-center justify-center">
        <p className="text-white">Cargando videos...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">
        Videos Recomendados
      </h2>

      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {videos.map((video) => (
              <div key={video.id} className="min-w-full">
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank" rel="noopener noreferrer" className="block"
                <a>
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                      <div className="p-6 w-full">
                        <h3 className="text-white text-xl font-semibold mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {video.channelTitle}
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous video"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next video"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-orange-400 w-8"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSlider;
