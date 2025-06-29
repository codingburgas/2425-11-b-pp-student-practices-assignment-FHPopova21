import React from 'react';
import { CheckCircle, Users, BarChart2, Mail, Star, Info, UserCheck } from 'lucide-react';

const About = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-to-tr from-yellow-200 to-beige-100 rounded-full p-3 shadow">
        <Info className="h-8 w-8 text-yellow-600" />
      </div>
      <h1 className="text-4xl font-extrabold text-beige-900 tracking-tight">За нас — SmartFit</h1>
    </div>
    <div className="grid md:grid-cols-2 gap-8 mb-10">
      <section className="bg-beige-50 rounded-xl shadow p-6 border-t-4 border-yellow-300">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Star className="h-6 w-6 text-yellow-500" /> Нашата мисия</h2>
        <p className="text-gray-700 leading-relaxed">
          Вярваме, че онлайн пазаруването на дрехи трябва да бъде лесно, точно и без разочарования. Затова създадохме <b>SmartFit</b> — интелигентна платформа, която препоръчва най-подходящия размер дрехи според индивидуалните мерки на потребителя и характеристиките на конкретната дреха.
        </p>
      </section>
      <section className="bg-beige-50 rounded-xl shadow p-6 border-t-4 border-blue-300">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><BarChart2 className="h-6 w-6 text-blue-500" /> Какъв проблем решаваме?</h2>
        <p className="text-gray-700 leading-relaxed">
          Онлайн пазаруването често е съпроводено с несигурност при избора на правилен размер. Това води до неудобства, връщане на продукти и загуба на време и средства както за клиента, така и за търговеца.<br/>
          <b>SmartFit</b> използва силата на машинното обучение, за да намали тези грешки и да подобри потребителското изживяване.
        </p>
      </section>
    </div>
    <div className="mb-10">
      <section className="bg-gradient-to-tr from-beige-50 to-white rounded-xl shadow p-6 border-l-4 border-green-300">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><UserCheck className="h-6 w-6 text-green-500" /> Как работи SmartFit?</h2>
        <ul className="list-disc ml-8 text-gray-700 mb-2">
          <li>Потребителски телесни параметри (височина, тегло, обиколки и др.)</li>
          <li>Характеристики на дрехата (тип, материя, размерни стойности)</li>
          <li>Машинно обучение, за да прогнозира точния размер с висока увереност</li>
        </ul>
        <p className="text-gray-700">Платформата предоставя препоръки с ясно посочена степен на увереност, както и алтернативен размер, когато прогнозата не е категорична.</p>
      </section>
    </div>
    <div className="grid md:grid-cols-2 gap-8 mb-10">
      <section className="bg-beige-50 rounded-xl shadow p-6 border-t-4 border-purple-300">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><CheckCircle className="h-6 w-6 text-purple-500" /> Използвани технологии</h2>
        <ul className="list-disc ml-8 text-gray-700">
          <li>Машинно обучение: <b>Random Forest</b> с калибрирани вероятности (CalibratedClassifierCV)</li>
          <li>Backend: <b>Python + Flask</b></li>
          <li>Frontend: <b>React + TypeScript</b></li>
          <li>База данни: <b>SQLite</b></li>
          <li>API: <b>RESTful</b></li>
          <li>Аутентикация: <b>Flask-Login</b></li>
        </ul>
      </section>
      <section className="bg-beige-50 rounded-xl shadow p-6 border-t-4 border-pink-300">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Star className="h-6 w-6 text-pink-500" /> Модел и прогнозна логика</h2>
        <p className="text-gray-700 mb-2">Използваме <b>RandomForestClassifier</b>, трениран върху реални потребителски и продуктови данни. Моделът е калибриран, за да дава не само размер, но и увереност в прогнозата.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <b>📈 Резултати на модела:</b><br/>
            <span>Точност: <b className="text-green-700">99.57%</b></span><br/>
            <span>Brier score: <b>0.0053</b></span><br/>
            <span>Най-важни характеристики: <b>гръдна обиколка &gt; тегло &gt; талия &gt; височина</b></span>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <b>📌 Входни данни:</b><br/>
            <span>Числови: гръдна обиколка, талия, тегло, височина</span><br/>
            <span>Категориални: пол, телосложение, тип и материя на дрехата</span>
          </div>
        </div>
      </section>
    </div>
    <div className="mb-10">
      <section className="bg-gradient-to-tr from-beige-50 to-white rounded-xl shadow p-6 border-l-4 border-orange-300">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Users className="h-6 w-6 text-orange-500" /> За кого е SmartFit?</h2>
        <table className="w-full mb-2 border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-beige-100">
              <th className="p-2">Роля</th>
              <th className="p-2">Какво получава</th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-beige-50">
              <td className="p-2">🧍‍♀️ Потребител</td>
              <td className="p-2">Препоръки за точния размер дрехи, базирани на лични мерки</td>
            </tr>
            <tr className="even:bg-beige-50">
              <td className="p-2">🧵 Търговец</td>
              <td className="p-2">Възможност за качване на продукти и анализ на потребителските нужди</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
    <div className="mb-10">
      <section className="bg-beige-50 rounded-xl shadow p-6 border-t-4 border-green-400">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><CheckCircle className="h-6 w-6 text-green-600" /> Какво печелите?</h2>
        <ul className="list-disc ml-8 text-gray-700">
          <li>📏 По-малко върнати поръчки</li>
          <li>🤖 По-точни препоръки с помощта на AI</li>
          <li>🛍️ По-добро потребителско изживяване</li>
          <li>📊 Възможност за анализ и подобрение на продуктите</li>
        </ul>
      </section>
    </div>
    <div className="mb-10">
      <section className="bg-gradient-to-tr from-beige-50 to-white rounded-xl shadow p-6 border-l-4 border-blue-400">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Mail className="h-6 w-6 text-blue-600" /> Свържете се с нас</h2>
        <p className="text-gray-700">
          Ако имате въпроси или желаете да интегрирате SmartFit във вашия онлайн магазин, не се колебайте да се свържете с нас.
        </p>
      </section>
    </div>
    <div className="mt-8 p-6 bg-gradient-to-tr from-yellow-100 to-beige-50 rounded-xl shadow text-center">
      <b className="text-xl">💡 SmartFit прави онлайн пазаруването по-умно, по-точно и по-удобно.<br/>С нашата технология правилният размер вече не е въпрос на късмет.</b>
    </div>
  </div>
);

export default About; 