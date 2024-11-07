import BlogSection from "@/components/BlogSection";
import NewsLetter from "@/components/NewsLetterForm";

export const revalidate = 1;

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-16 bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Sanity + Resend 📨
        </h1>
        <p className="mt-4 text-2xl italic text-gray-700">
          Email
          <span className=" font-bold italic text-gray-900"> is</span> {""}
          content
        </p>
      </div>
      <div className="mt-16 w-full  p-8 bg-white rounded-lg shadow-md">
        <NewsLetter />
        <BlogSection />
      </div>
    </div>
  );
}
