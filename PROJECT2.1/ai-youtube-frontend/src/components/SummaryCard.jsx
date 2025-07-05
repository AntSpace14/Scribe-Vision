// src/components/SummaryCard.jsx
import { AuroraText } from "./magicui/aurora-text";

export default function SummaryCard({ summary }) {
  const lines = summary
    .split("\n")
    .map((line) =>
      line
        .replace(/^#+\s*/, "")
        .replace(/^[-*•]\s*/, "")
        .trim()
    )
    .filter((line) => line.length > 0);

  return (
    <div className="mt-10 px-4 sm:px-0 animate-fade-in-up">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-700 tracking-tight flex items-center gap-2">
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          ✨ Summary
        </span>
        <AuroraText speed={1.3}>Insights</AuroraText>
      </h3>

      <div className="relative isolate overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-300 p-6 sm:p-8 transition-all duration-300 hover:scale-[1.015] shadow-md">
        {/* Glow ring effect */}
        <div className="absolute -inset-4 -z-10 rounded-[inherit] bg-gradient-to-r from-purple-100 via-transparent to-pink-100 blur-xl opacity-25"></div>

        {lines.map((line, idx) => {
          const isHeading =
            line.endsWith(":") &&
            /^[A-Z]/.test(line) &&
            line.split(" ").length < 12;

          return (
            <p
              key={idx}
              className={`leading-relaxed ${
                isHeading ? "font-semibold text-gray-800" : "text-gray-700"
              }`}
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
