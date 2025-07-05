export default function CommentCard({ comment }) {
  const sentimentColor =
    comment.sentiment === "positive"
      ? "text-green-600"
      : comment.sentiment === "negative"
      ? "text-red-600"
      : "text-gray-500";

  return (
    <div className="border-b border-gray-200 pb-4 px-1 sm:px-2 text-sm sm:text-[15px] leading-snug hover:bg-gray-50 transition-colors rounded-md">
      <div className="mb-1 flex justify-between items-center text-xs sm:text-sm text-gray-600">
        <span className="font-medium text-gray-800 truncate">
          @{comment.username}
        </span>
        <span className="text-gray-400">{comment.likes} likes</span>
      </div>
      <p className={`italic mb-2 ${sentimentColor} text-xs sm:text-sm`}>
        {comment.sentiment}
      </p>
      <p className="text-gray-700 text-sm sm:text-base">{comment.text}</p>
    </div>
  );
}
