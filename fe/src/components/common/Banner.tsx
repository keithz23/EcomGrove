import { EURI } from "../../enums/EURI";
import "react-lazy-load-image-component/src/effects/blur.css";
import { categories } from "../../utils";

export default function Banner() {
  return (
    <>
      {/* Full-Screen Video Banner */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video
          className="absolute w-full h-full object-cover opacity-80"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          controls={false}
        >
          <source src={`${EURI.MEDIA_URI}/banner.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>

        {/* Category Carousel */}
        <div className="relative z-10 w-full max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
            Discover Our Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {categories.map((category: any) => (
              <div key={category.name} className="relative group w-40 md:w-48">
                {/* Category Button */}
                <div className="relative bg-white bg-opacity-10 backdrop-blur-md rounded-full p-4 text-center text-black font-medium uppercase tracking-wide transition-all duration-300 group-hover:bg-opacity-20 group-hover:scale-105">
                  {category.name}
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:flex flex-col bg-white bg-opacity-95 rounded-lg shadow-lg w-52 z-50 py-2 text-black">
                  {category.products.map((product: any) => (
                    <a
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="px-4 py-2 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                    >
                      {product.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
