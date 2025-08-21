import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="card-bg rounded-lg shadow-lg border border-color p-10 relative">
      {/* 右上角返回图标 - 使用绝对定位 */}
      <Link 
        href="/" 
        className="absolute top-6 right-6 text-color hover:hover-color p-2 rounded transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      <h1 className="text-4xl font-bold text-color mb-8 text-center">
        关于我
      </h1>

      <div className="max-w-2xl mx-auto">
        {/* 个人简介区域 */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
            <Image
              src="/dog.svg" 
              alt="" 
              width={128}   
              height={128}  
              className="object-cover" 
            />
          </div>
          <h2 className="text-2xl font-bold text-color mb-2">
            肥古
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            一位热爱技术的开发者
          </p>
        </div>

        {/* 详细介绍 */}
        <div className="space-y-6 text-color">
          <div>
            <h3 className="text-xl font-bold mb-3">👋 你好，欢迎来到我的博客！</h3>
            <p className="leading-relaxed">
              这个博客是我记录技术学习心得、项目经验和生活感悟的地方。
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">🔧 技术栈</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>前端：</strong> React, Next.js, TypeScript, Tailwind CSS</li>
              <li><strong>后端：</strong> Node.js, Python, Java</li>
              <li><strong>数据库：</strong> PostgreSQL, MySQL, SQLite, MongoDB</li>
              <li><strong>工具：</strong> Git, Docker, VS Code</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">📫 联系方式</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>邮箱: feigu4103@gmail.com</li>
              <li>电话: 18950881882</li>
              <li>
                GitHub: 
                <a 
                  href="https://github.com/Fffgu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline ml-1 dark:text-blue-400"
                >
                  Fffgu
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
    