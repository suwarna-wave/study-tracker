document.addEventListener('DOMContentLoaded', () => {
  const subjectForm = document.getElementById('subject-form');
  const subjectDropdown = document.getElementById('subject-dropdown');
  const progressChartCanvas = document.getElementById('progress-chart');
  const chapterList = document.getElementById('chapter-list');
  const chaptersCompleted = document.getElementById('chapters-completed');
  const progressPercentage = document.getElementById('progress-percentage');
  const calendarForm = document.getElementById('calendar-form');
  const daysInput = document.getElementById('days-input');
  const daysRemainingElement = document.getElementById('days-remaining');
  const clearDataBtn = document.getElementById('clear-data-btn');

  const subjects = JSON.parse(localStorage.getItem('subjects')) || {};
  let currentSubject = null;
  let daysRemaining = JSON.parse(localStorage.getItem('daysRemaining')) || 100;

  const saveSubjects = () => {
      localStorage.setItem('subjects', JSON.stringify(subjects));
  };

  const saveSubjectData = () => {
      if (currentSubject) {
          localStorage.setItem(`subject-${currentSubject.name}-completedChapters`, currentSubject.completedChapters);
      }
  };

  const loadSubjectData = () => {
      if (currentSubject) {
          currentSubject.completedChapters = parseInt(localStorage.getItem(`subject-${currentSubject.name}-completedChapters`)) || 0;
      }
  };

  const updateProgress = () => {
      if (!currentSubject) return;

      const completedChapters = currentSubject.completedChapters || 0;
      const totalChapters = currentSubject.totalChapters;

      new Chart(progressChartCanvas, {
          type: 'doughnut',
          data: {
              labels: ['Completed', 'Remaining'],
              datasets: [{
                  data: [completedChapters, totalChapters - completedChapters],
                  backgroundColor: ['#4CAF50', '#f44336']
              }]
          }
      });

      chaptersCompleted.textContent = completedChapters;
      const percentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
      progressPercentage.textContent = `${percentage}%`;
  };

  const renderChapters = () => {
      chapterList.innerHTML = '';

      if (!currentSubject) {
          chapterList.innerHTML = '<p>Select or add a subject to view its chapters and lessons.</p>';
          return;
      }

      for (let i = 1; i <= currentSubject.totalChapters; i++) {
          const isChecked = localStorage.getItem(`subject-${currentSubject.name}-chapter-${i}`);
          const chapterDiv = document.createElement('div');
          chapterDiv.innerHTML = `
              <label>
                  <input type="checkbox" data-chapter="${i}" ${isChecked ? 'checked' : ''} />
                  Chapter ${i}
              </label>
          `;
          chapterList.appendChild(chapterDiv);
      }

      updateProgress();
  };

  subjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const subjectName = document.getElementById('subject-name').value;
      const totalChapters = parseInt(document.getElementById('total-chapters').value, 10);

      if (subjectName && totalChapters > 0) {
          subjects[subjectName] = { name: subjectName, totalChapters, completedChapters: 0 };
          const option = document.createElement('option');
          option.value = subjectName;
          option.textContent = subjectName;
          subjectDropdown.appendChild(option);

          document.getElementById('subject-name').value = '';
          document.getElementById('total-chapters').value = '';
          saveSubjects();
      }
  });

  subjectDropdown.addEventListener('change', () => {
      const selectedValue = subjectDropdown.value;
      if (selectedValue) {
          saveSubjectData();
          currentSubject = subjects[selectedValue];
          loadSubjectData();
          renderChapters();
      }
  });

  chapterList.addEventListener('change', (e) => {
      if (!currentSubject || e.target.type !== 'checkbox') return;

      const chapterNum = e.target.getAttribute('data-chapter');
      if (e.target.checked) {
          currentSubject.completedChapters += 1;
          localStorage.setItem(`subject-${currentSubject.name}-chapter-${chapterNum}`, true);
      } else {
          currentSubject.completedChapters = Math.max(0, currentSubject.completedChapters - 1);
          localStorage.removeItem(`subject-${currentSubject.name}-chapter-${chapterNum}`);
      }

      saveSubjectData();
      updateProgress();
  });

  calendarForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const days = parseInt(daysInput.value, 10);
      if (days > 0) {
          daysRemaining = days;
          daysRemainingElement.textContent = daysRemaining;
          daysInput.value = '';
          localStorage.setItem('daysRemaining', JSON.stringify(daysRemaining));
      } else {
          alert('Please enter a valid number of days.');
      }
  });

  clearDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data 🗑?')) {
          localStorage.clear();
          location.reload();
      }
  });

  daysRemainingElement.textContent = daysRemaining;

  Object.keys(subjects).forEach(subjectKey => {
      const option = document.createElement('option');
      option.value = subjectKey;
      option.textContent = subjects[subjectKey].name;
      subjectDropdown.appendChild(option);
  });

  if (subjectDropdown.value) {
      currentSubject = subjects[subjectDropdown.value];
      renderChapters();
  }
});
