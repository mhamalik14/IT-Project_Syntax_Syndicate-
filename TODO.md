# TODO: Fix Expanding Charts in Admin Dashboard Analytics

## Steps to Complete
- [x] Import Chart.js components in AdminDashboard.jsx
- [x] Replace static cards in 'Reports & Analytics' tab with actual charts using react-chartjs-2
- [x] Set fixed dimensions for charts to prevent expansion
- [ ] Test the changes by running the development server

## Information Gathered
- AdminDashboard.jsx contains a 'reports' tab with static metric cards (no actual charts currently).
- Chart.js and react-chartjs-2 dependencies are installed in package.json.
- The issue is charts expanding; implementing fixed-size charts will resolve this.

## Plan
- Add imports for Chart.js and react-chartjs-2 components.
- Create chart data objects for metrics like monthly appointments, top clinics, etc.
- Replace the grid of cards with chart components wrapped in fixed-dimension divs.
- Use Bar chart for appointments over time, Pie chart for clinic distribution, etc.

## Dependent Files
- clinic_scheduler_frontend/src/pages/AdminDashboard.jsx

## Followup Steps
- Run `npm run dev` in clinic_scheduler_frontend to test the changes.
- Verify charts display data without expanding.
