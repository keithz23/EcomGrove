import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container flex flex-col justify-center mx-auto h-screen">
        <div className="container flex flex-col items-center gap-3">
          <img
            src="https://shofy-svelte.vercel.app/img/error/error.png"
            alt="404 Error"
          />
          <h1 className="text-gray-700 text-4xl font-semibold">
            404 Not Found
          </h1>
          <span className="text-gray-700 text-xl text-wrap">
            Whoops, this is embarrassing. Looks like the page you were looking
            for wasn't found.
          </span>
          <button
            className="px-5 py-2 font-semibold bg-[#0989ff] text-white hover:cursor-pointer hover:bg-black transition-all duration-300"
            onClick={() => navigate('/')}
          >
            Back To Home
          </button>
        </div>
      </div>
    </>
  );
}