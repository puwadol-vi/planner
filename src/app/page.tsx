import Link from 'next/link';
import Image from 'next/image';
import { Calculator, Shield, TrendingUp, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header: cover + icon overlay + title (match ref) */}
        <header className="mb-8">
          <div className="relative w-full -mx-4 md:mx-0 rounded-t-2xl overflow-hidden aspect-2/1 max-h-[30vh] bg-slate-800">
            <Image
              src="/images/home/cover.jpg"
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden bg-slate-900/80 ring-2 ring-white/20">
              <Image
                src="/images/home/logo.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-4">
            Free your time with system (Bitcoin)
          </h1>
        </header>

        {/* Tagline (ref: first thing in body) */}
        <p className="text-lg text-slate-300 leading-relaxed font-semibold mb-6">
          เข้าใจ &quot;ระบบ&quot; เเละ Bitcoin วางเเผนการเงินเพื่ออิสรภาพทางด้าน &quot;เวลา&quot; จากพื้นฐานการเงินเป็นศูนย์ ปรับใช้ Set ระบบชีวิตได้ภายใน 1 วัน
        </p>

        {/* Hero image (ref: right after tagline) */}
        <div className="relative w-full aspect-16/10 max-h-[360px] rounded-xl overflow-hidden bg-slate-800 mb-10">
          <Image
            src="/images/home/hero.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>

        {/* ❎ ปัญหา */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
            ❎ ปัญหาการวางเเผนการเงินปัจจุบันที่หลายคนเจอ
          </h2>
          <ul className="space-y-2 text-slate-400 list-disc list-inside">
            <li>การวางแผนการเงินในปัจจุบัน เเค่เเนะนำให้ทุกคนเอาเงินไป &quot;ลงทุน&quot; เพราะ &quot;เงินเฟ้อ&quot;</li>
            <li>คนส่วนมากไม่ทราบว่าเงินเฟ้อมากกว่า 3% โดยเฉลี่ยคือ 7% ต่อปีเเละถ้าผ่านไป 10 ปี เงินลดค่าไป 50%!</li>
            <li>หลายคนไม่เข้าใจว่า &quot;ระบบ&quot; ปัจจุบันทำลายเงินออมของคุณในทุกวัน!</li>
            <li>ระบบที่คุณ &quot;ก่อหนี้&quot; เเละเมื่อเวลาผ่านไป ก้อนหนี้ของคุณจะเล็กลง ซึ่งคนทั่วไปกลัวหนี้เเละ ไม่ทราบวิธีใช้หนี้เป็นเครื่องมือ!</li>
            <li>เเนะนำเเค่ว่าควรลงทุนให้ได้กี่ % ต่อปี เเค่นำเงินมาลงทุน ซึ่ง การลงทุน เป็นเเค่ส่วนนึงของ &quot;ระบบ&quot; เท่านั้น</li>
            <li>เงินออมทั้งหมดไปลงทุน เเละถ้าผิดทางล่ะ? โดยไม่เข้าใจ เงินออม เเละ เงินลงทุน</li>
            <li>เเม้ได้กำไรปีละ 10% เเต่ไม่สามารถเกษียณได้ เเละโดยทั่วไปคือ เสี่ยงเพิ่ม!</li>
          </ul>
          <p className="mt-6 text-red-300 font-medium">
            🔴คำถามคือ วิธีนี้ได้ผลจริงมั้ย? เเค่มองไปรอบตัวคนที่บอกว่าตัวเอง &quot;เกษียณ&quot; ได้ น่าจะนับนิ้วได้เลย
          </p>
          <a
            href="https://web.facebook.com/juicesakkasem.supp?_rdc=1&_rdr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-orange-500 text-slate-900 font-semibold hover:bg-cyan-400 transition-colors mb-6"
          >
            สมัคร Inbox Message
          </a>
        </section>

        {/* 📍 วางแผนการเงินไม่ใช่แค่เรื่องตัวเลข */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
            📍วางเเผนการเงินไม่ใช่เเค่เรื่องตัวเลขเกษียณ<br className="hidden md:inline" /> มันคือ &quot;ระบบ&quot; ที่ต่อกันจนเห็นภาพทั้งหมด
          </h2>
          <blockquote className="border-l-4 border-cyan-500 pl-4 py-2 text-slate-200 font-medium my-4">
            คุณไม่ได้ต้องการเงินเยอะ เเต่จริงๆ คุณเเค่ต้องการการ &quot;เวลา&quot; เป็นของตัวเอง เเละ เงิน คือ เครื่องมือซื้อเวลา
          </blockquote>
          <p className="text-slate-400 mb-2">
            เเละสิ่งที่คุณต้องการจริงๆคือ &quot;ระบบ&quot; ของการวางเเผนการเงิน มันไม่ใช่เเค่อ่าน fact sheet เเล้วลงทุน หรือเเค่ ทำประกัน
          </p>
          <p className="text-slate-400 mb-2">เเละนี่คือสิ่งที่ทำให้คุณเปลี่ยนเเปลงใน</p>
          <p className="text-slate-400 font-bold border-b border-slate-400/50 pb-0.5 inline-block mb-4">
            Free your time with system (Bitcoin)
          </p>
          <ul className="space-y-2 text-slate-400 list-disc list-inside mb-4">
            <li>เข้าใจระบบการเงินปัจจุบันที่คุณอยู่ ว่าสามารถพิมพ์เงินได้ เเละ ลดมูลค่าเงินในกระเป๋าของคุณ</li>
            <li>Hard Money ทำไมสำคัญ มนุษย์เคยรุ่งเรื่องมากๆในยุค Hard Money</li>
            <li>ทำไมชีวิตคุณลำบากมากกว่ายุคก่อน เพราะ เงินเฟ้อ</li>
            <li>รู้จักเงินออม เเละ เงินลงทุน ที่ปัจจุบัน 2 สิ่งนี้ ปนกัน ทำให้คนหมดตัวได้</li>
            <li>Asymmetric Risk เสี่ยงเท่าเดิม เเต่โตไม่จำกัด</li>
            <li>ระบบ ที่จะทำให้เห็นภาพรวม ของการวางเเผนการเงินที่ไม่ใช่เเค่ ลงทุนได้กำไรกี่ % ต่อปี</li>
            <li>หนี้ คือสิ่งที่ทุกคนกลัว เพราะไม่เข้าใจ เเต่ในระบบ Fiat การมีหนี้ อาจเป็นข้อได้เปรียบที่คนไม่เคยรู้</li>
            <li>เข้าใจทำไมคน 90% ล้มเหลวในการลงทุนเพื่อเเผนเกษียณ</li>
            <li>วิธีคำนวนเเผนเกษียณ เเละ คำนวนว่าเมื่อไหร่ควรลงทุน ไม่ใช่ มีเงิน เเละ ลงทุนทันที</li>
          </ul>
          <p className="text-slate-400">มันคือแผนที่ เเต่มันไม่ใช่วิธี ลงทุนได้ 100x รวยในข้ามคืน</p>          <a
            href="https://web.facebook.com/juicesakkasem.supp?_rdc=1&_rdr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-orange-500 text-slate-900 font-semibold hover:bg-cyan-400 transition-colors mb-6"
          >
            สมัคร Inbox Message
          </a>
        </section>

        {/* 💡 มันสามารถเปลี่ยนเเปลงได้จริงใช่มั้ย? */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
            💡มันสามารถเปลี่ยนเเปลงได้จริงใช่มั้ย?
          </h2>
          <p className="text-slate-400 mb-2">
            มันไม่ใช่เรื่องเนื้อหาที่ต้องท่องจำสูตร หรือ เข้าใจ Product ทางการลงทุน เเต่มันคือ &quot;Framework&quot;
          </p>
          <blockquote className="border-l-4 border-slate-500 pl-4 py-2 text-slate-300 italic my-4">
            เมื่อคุณเห็นความจริงเเล้ว คุณ ไม่สามารถที่จะลืมมันได้
          </blockquote>
          <p className="text-slate-400 mb-2">เเละถ้าสิ่งที่คุณวางเเผนทางการเงินมา คือ มันไม่เวิร์ก คุณจะทำมันซ้ำมั้ย</p>
          <p className="text-slate-400 mb-2">เมื่อทำ &quot;เหตุ&quot; เหมือนเดิมเเต่ต้องการ &quot;ผลลัพธ์&quot; ที่เปลี่ยนไป หรือคุณต้องเปลี่ยน &quot;เหตุ&quot;</p>
          <p className="text-slate-400">
            ไม่ได้บอกว่าเรียนเเล้วจะมีเงินเกษียณเร็วขึ้น เเต่ คุณจะได้ มุมมองที่เปลี่ยนไปเเน่นอน คุณจะเข้าใจคำว่า Low time Reference คืออะไร
          </p>
        </section>

        {/* Callout 💡 */}
        <section className="rounded-xl bg-slate-800/80 border border-slate-700 p-6">
          <div className="flex gap-4">
            <span className="text-3xl shrink-0">💡</span>
            <p className="text-slate-200 font-semibold leading-relaxed">
              Free your time with system (Bitcoin) ช่วยให้คุณ มี ระบบ ในการเก็บเงินเพื่อซื้อ เวลา ของคุณในอนาคต
            </p>
          </div>
        </section>

        <a
          href="https://web.facebook.com/juicesakkasem.supp?_rdc=1&_rdr"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 mb-10 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-orange-500 text-slate-900 font-semibold hover:bg-cyan-400 transition-colors mb-6"
        >
          สมัคร Inbox Message
        </a>

        {/* ➡️ เนื้อหา Free your time with system (Bitcoin) */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-200 mb-6">
            ➡️เนื้อหา Free your time with system (Bitcoin)
          </h2>

          <h3 className="text-base font-semibold text-slate-300 mt-6 mb-2">Part 1 Problem</h3>
          <ol className="list-decimal list-inside text-slate-400 space-y-1 mb-4">
            <li>เข้าใจระบบการเงินเดิม ปัจจุบันเราอยู่ในระบบการเงินอะไร</li>
            <li>เงินคืออะไร ทำไม Hard Money ถึงสำคัญ</li>
            <li>ปัญหาของการออม เเละ การวางเเผนการเงินปัจจุบัน ที่ไม่สามารถให้เรา Free time ได้</li>
          </ol>

          <h3 className="text-base font-semibold text-slate-300 mt-6 mb-2">Part 2 Planning</h3>
          <ol className="list-decimal list-inside text-slate-400 space-y-1 mb-4">
            <li>คำนวนมูลค่าเงินที่สามารถ Free Time ได้</li>
            <li>การออมคืออะไร คำนวนเปรียบเทียบ ที่เก็บมูลค่าในสินทรัพย์ต่างๆ</li>
            <li>ปัญหาของการลงทุน - กับดักเงินจำนวนน้อย Survivalship Bias เเละสิ่งที่คนส่วนใหญ่พลาดคือลงทุนทันที</li>
            <li>Symmetric Risk VS Asymmetric Risk</li>
          </ol>

          <h3 className="text-base font-semibold text-slate-300 mt-6 mb-2">Part 3 System</h3>
          <ol className="list-decimal list-inside text-slate-400 space-y-1 mb-4">
            <li>5 ขั้นตอน สร้าง &quot;ระบบ&quot; (การสะสมทุน) - Arbitrage</li>
            <li>เมื่อไหร่ควรลงทุน</li>
            <li>หนี้รายได้ - หนี้สินทรัพย์</li>
            <li>Hurdle rate Fiat VS Hurdle rate Bitcoin</li>
            <li>Discount Rate คือ</li>
            <li>Digital capital - Digital credit</li>
            <li>เครื่องมือ Future - Option 101</li>
          </ol>

          <h3 className="text-base font-semibold text-slate-300 mt-6 mb-2">Part 4 Borrow + Save your Money</h3>
          <ol className="list-decimal list-inside text-slate-400 space-y-1">
            <li>ABS (Asset backed securities) VS Sell</li>
            <li>Insurance กับ Port</li>
            <li>Hardware wallet เเละ การเก็บรักษา</li>
            <li>ส่งมอบ Legacy</li>
          </ol>
        </section>

        {/* เครื่องมือวางแผน (app-only) */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">🛠️ เครื่องมือวางแผน</h2>
          <p className="text-slate-400 mb-4 text-sm">ใช้เครื่องมือด้านล่างช่วยคำนวณและเห็นภาพระบบการเงิน</p>
          <div className="grid gap-4">
            <Link
              href="/bitcoin-wealth-planner"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-white block">Bitcoin Wealth Planner</span>
                <span className="text-sm text-slate-400">DCA, Take Profit, เปรียบเทียบ S&P / HODL / Hybrid</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
            </Link>
            <Link
              href="/bitcoin-vs-insurance-simulator"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-white block">Bitcoin vs Insurance Simulator</span>
                <span className="text-sm text-slate-400">เปรียบเทียบสะสม BTC อย่างเดียว กับ BTC + ประกัน (Fiat Shield)</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
            </Link>
            <Link
              href="/when-should-i-invest"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Calculator className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-white block">เมื่อไหร่ควรลงทุน</span>
                <span className="text-sm text-slate-400">Strategic Investment Entry – เงินออม vs เงินลงทุน, Risk Impact</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 shrink-0" />
            </Link>
          </div>          <a
            href="https://web.facebook.com/juicesakkasem.supp?_rdc=1&_rdr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-orange-500 text-slate-900 font-semibold hover:bg-cyan-400 transition-colors mb-6"
          >
            สมัคร Inbox Message
          </a>
        </section>

        {/* ABOUT ME */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-200 mb-4">ABOUT ME</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden bg-slate-800">
              <Image
                src="/images/home/author.jpg"
                alt="Juice Sakkasem"
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Juice Sakkasem</h2>
              <p className="text-cyan-400 font-medium">Financial Bitcoiner</p>
              <ul className="mt-3 text-slate-400 text-sm space-y-1 list-disc list-inside">
                <li>เขียนบทความเกี่ยวกับ Bitcoin การวางเเผนการเงินด้วย ระบบ เเละ Hard Money</li>
                <li>Financial Consultant ในระบบเดิม รู้ Pain ที่เกิดขึ้นในระบบปัจจุบัน</li>
                <li>เข้าใจกลุ่มคนที่ไม่เคยวางเเผนการเงิน เเละ ไม่เคยทราบว่าระบบปัจจุบันทำร้าย เงินออม</li>
                <li>สนใจเรื่อง Health ที่เกี่ยวข้องกับ เเสงเเดด มีความเข้าใจผิดเกี่ยวกับ เเสงเเดด เป็นอย่างมาก</li>
              </ul>
            </div>
          </div>          <a
            href="https://web.facebook.com/juicesakkasem.supp?_rdc=1&_rdr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-orange-500 text-slate-900 font-semibold hover:bg-cyan-400 transition-colors mb-6"
          >
            สมัคร Inbox Message
          </a>
        </section>

        {/* Contact me */}
        <footer className="pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="flex items-start gap-4 shrink-0">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-800">
                <Image
                  src="/images/home/author.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="84px"
                />
              </div>
              <div>
                <p className="font-bold text-white">Juice Sakkasem</p>
                <p className="text-slate-400 text-sm">Financial Bitcoiner</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-200 mb-3">Contact me</p>
              <hr className="border-slate-700 mb-3" />
              <a
                href="https://www.facebook.com/juicesakkasem.supp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
              >
                <Image src="/images/home/icon-download.png" alt="" width={20} height={20} className="opacity-80" />
                Facebook
              </a>
            </div>
          </div>
          <div className="mt-8 text-sm text-slate-500">
            <p>มันไม่ใช่เรื่องเนื้อหาที่ต้องท่องจำสูตร เเต่มันคือ &quot;Framework&quot;</p>
            <p className="mt-2 italic text-slate-400">เมื่อคุณเห็นความจริงเเล้ว คุณ ไม่สามารถที่จะลืมมันได้</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
