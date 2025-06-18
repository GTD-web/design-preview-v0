import React from "react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* 헤더 */}
      <header className="w-full h-16 flex items-center justify-between px-lg bg-primary/80 text-white font-heading text-2xl shadow-lg backdrop-blur-md z-modal sticky top-0">
        <div className="flex items-center gap-sm">
          <span className="text-3xl">🎨</span>
          <span className="ml-sm">Design Dashboard</span>
        </div>
        <div className="flex items-center gap-md">
          <button className="relative">
            <span className="text-2xl">🔔</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full border-2 border-primary"></span>
          </button>
          <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center shadow-md border border-border">
            <span className="text-lg">👤</span>
          </div>
        </div>
      </header>
      {/* 3단 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-dashboard gap-layout px-lg py-lg transition-all">
        {/* 사이드바 */}
        <aside className="bg-surface/80 rounded-2xl shadow-lg p-lg flex flex-col gap-md min-h-[60vh] backdrop-blur-md border border-border">
          <nav className="flex flex-col gap-sm">
            <span className="text-heading text-lg font-bold mb-sm tracking-wide">메뉴</span>
            <a
              href="#"
              className="flex items-center gap-xs text-body py-xs px-md rounded-lg hover:bg-primary/10 hover:text-primary transition font-medium group active:bg-primary/20"
            >
              <span className="text-xl">🏠</span>
              <span>대시보드</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-xs text-body py-xs px-md rounded-lg hover:bg-primary/10 hover:text-primary transition font-medium group"
            >
              <span className="text-xl">📁</span>
              <span>프로젝트</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-xs text-body py-xs px-md rounded-lg hover:bg-primary/10 hover:text-primary transition font-medium group"
            >
              <span className="text-xl">⚙️</span>
              <span>설정</span>
            </a>
          </nav>
        </aside>
        {/* 메인 */}
        <main className="flex flex-col gap-lg">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* 카드 위젯 */}
            <div className="relative bg-gradient-to-br from-success/20 to-success/5 border border-success rounded-2xl p-xl shadow-lg overflow-hidden group transition hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center gap-md mb-md">
                <span className="text-3xl">✅</span>
                <div className="text-success font-heading text-xl">완료된 작업</div>
              </div>
              <div className="text-4xl font-bold mb-xs">24</div>
              <div className="text-body text-sm opacity-70">이번 주 완료</div>
              <div className="absolute right-4 bottom-4 opacity-10 text-7xl select-none">✔️</div>
            </div>
            <div className="relative bg-gradient-to-br from-warning/20 to-warning/5 border border-warning rounded-2xl p-xl shadow-lg overflow-hidden group transition hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center gap-md mb-md">
                <span className="text-3xl">🚧</span>
                <div className="text-warning font-heading text-xl">진행 중</div>
              </div>
              <div className="text-4xl font-bold mb-xs">5</div>
              <div className="text-body text-sm opacity-70">현재 진행</div>
              <div className="absolute right-4 bottom-4 opacity-10 text-7xl select-none">⏳</div>
            </div>
            <div className="relative bg-gradient-to-br from-info/20 to-info/5 border border-info rounded-2xl p-xl shadow-lg overflow-hidden group transition hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center gap-md mb-md">
                <span className="text-3xl">📢</span>
                <div className="text-info font-heading text-xl">알림</div>
              </div>
              <div className="text-4xl font-bold mb-xs">3</div>
              <div className="text-body text-sm opacity-70">새로운 알림</div>
              <div className="absolute right-4 bottom-4 opacity-10 text-7xl select-none">🔔</div>
            </div>
            <div className="relative bg-gradient-to-br from-danger/20 to-danger/5 border border-danger rounded-2xl p-xl shadow-lg overflow-hidden group transition hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center gap-md mb-md">
                <span className="text-3xl">❗</span>
                <div className="text-danger font-heading text-xl">이슈</div>
              </div>
              <div className="text-4xl font-bold mb-xs">1</div>
              <div className="text-body text-sm opacity-70">긴급 확인</div>
              <div className="absolute right-4 bottom-4 opacity-10 text-7xl select-none">⚠️</div>
            </div>
          </section>
          {/* 최근 활동 */}
          <section className="bg-surface/80 rounded-2xl shadow-lg p-xl backdrop-blur-md border border-border">
            <div className="font-heading text-lg mb-md flex items-center gap-xs">
              <span className="text-xl">🕒</span>
              최근 활동
            </div>
            <ul className="list-none pl-0 text-body divide-y divide-border">
              <li className="py-sm flex items-center gap-xs">
                <span className="text-success">●</span> 새로운 프로젝트가 생성되었습니다.
              </li>
              <li className="py-sm flex items-center gap-xs">
                <span className="text-success">●</span> 작업 3건이 완료되었습니다.
              </li>
              <li className="py-sm flex items-center gap-xs">
                <span className="text-info">●</span> 알림 1건이 도착했습니다.
              </li>
            </ul>
          </section>
        </main>
        {/* 보조 패널 */}
        <aside className="bg-surface/80 rounded-2xl shadow-lg p-lg flex flex-col gap-md min-h-[60vh] backdrop-blur-md border border-border">
          <div className="font-heading text-lg mb-md flex items-center gap-xs">
            <span className="text-xl">🔔</span>
            알림
          </div>
          <div className="bg-info/10 border-l-4 border-info p-md rounded-lg mb-md shadow-sm">
            <div className="text-info font-bold flex items-center gap-xs">
              시스템 점검 예정 <span className="text-base">🛠️</span>
            </div>
            <div className="text-body text-sm">6월 10일 02:00~04:00</div>
          </div>
          <div className="bg-warning/10 border-l-4 border-warning p-md rounded-lg shadow-sm">
            <div className="text-warning font-bold flex items-center gap-xs">
              업데이트 필요 <span className="text-base">⚡</span>
            </div>
            <div className="text-body text-sm">프로필 정보를 확인하세요.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
