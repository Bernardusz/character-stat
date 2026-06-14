import { Component, input } from '@angular/core';
import { CharacterStats } from '@/app/types/dashboard.types';

@Component({
  selector: 'app-stat-bars',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-900 border border-slate-800 rounded-xl mb-8">
      <div class="space-y-2">
        <div class="flex justify-between text-sm font-semibold text-amber-400">
          <span>⚡ ENERGY</span>
          <span>{{ stats().energyScore }}/100</span>
        </div>
        <div class="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div class="h-full bg-linear-to-r from-amber-500 to-yellow-400 transition-all duration-500"
               [style.width.%]="stats().energyScore"></div>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between text-sm font-semibold text-rose-400">
          <span>❤️ HEALTH</span>
          <span>{{ stats().healthScore }}/100</span>
        </div>
        <div class="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div class="h-full bg-linear-to-r from-rose-600 to-pink-500 transition-all duration-500"
               [style.width.%]="stats().healthScore"></div>
        </div>
      </div>

      <div class="bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-center">
        <div class="text-xs text-slate-400 font-medium uppercase tracking-wider">Completion Rate</div>
        <div class="text-2xl font-bold text-emerald-400 mt-1">{{ stats().completionRate }}%</div>
      </div>

      <div class="bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-center">
        <div class="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Quests</div>
        <div class="text-2xl font-bold text-indigo-400 mt-1">{{ stats().totalActiveTasks }}</div>
      </div>
    </div>
  `
})
export class StatBarsComponent {
  stats = input.required<CharacterStats>();
}