document.addEventListener('DOMContentLoaded', () => {
    const subjects = {
      SH551: { name: "Applied Mathematics", totalChapters: 10, totalLessons: 30 },
      SH553: { name: "Numerical Method", totalChapters: 8, totalLessons: 24 },
      CT552: { name: "Data Structure and Algorithm", totalChapters: 12, totalLessons: 36 },
      EX603: { name: "Computer Graphics", totalChapters: 6, totalLessons: 18 },
      CT551: { name: "Discrete Structure", totalChapters: 5, totalLessons: 15 },
    };
  
    const subjectDropdown = document.getElementById('subject-dropdown');
    const progressChartCanvas = document.getElementById('progress-chart');
    const chapterList = document.getElementById('chapter-list');
    const chaptersCompleted = document.getElementById('chapters-completed');
    const lessonsRemaining = document.getElementById('lessons-remaining');
    const progressPercentage = document.getElementById('progress-percentage');
  
    let currentSubject = null;
    let completedChapters = 0;
  
    const updateChart = () => {
      new Chart(progressChartCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Remaining'],
          datasets: [{
            data: [completedChapters, currentSubject.totalChapters - completedChapters],
            backgroundColor: ['#4CAF50', '#f44336']
          }]
        }
      });
    };
  
    const renderChapters = () => {
      chapterList.innerHTML = '';
      for (let i = 1; i <= currentSubject.totalChapters; i++) {
        const chapterDiv = document.createElement('div');
        chapterDiv.innerHTML = `
          <label>
            <input type="checkbox" data-chapter="${i}" />
            Chapter ${i}
          </label>
        `;
        chapterList.appendChild(chapterDiv);
      }
    };
  
    subjectDropdown.addEventListener('change', () => {
      const selectedValue = subjectDropdown.value;
      if (selectedValue) {
        currentSubject = subjects[selectedValue];
        completedChapters = 0;
        renderChapters();
        updateChart();
        chaptersCompleted.textContent = completedChapters;
        lessonsRemaining.textContent = currentSubject.totalLessons;
        progressPercentage.textContent = '0%';
      }
    });
  
    chapterList.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        completedChapters += e.target.checked ? 1 : -1;
        chaptersCompleted.textContent = completedChapters;
        progressPercentage.textContent = `${Math.round((completedChapters / currentSubject.totalChapters) * 100)}%`;
        updateChart();
      }
    });
  });
  