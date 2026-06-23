document.addEventListener('DOMContentLoaded', function() {
  var activeCategoryId = null;
  var activeDurationId = null;

  function getDurationsForCategory(catId) {
    var groups = document.querySelectorAll('.plan-group[data-category-id="' + catId + '"], .mobile-plan-group[data-category-id="' + catId + '"]');
    var seen = {};
    var durations = [];
    groups.forEach(function(g) {
      var durId = g.getAttribute('data-duration-id');
      if (!seen[durId]) {
        seen[durId] = true;
        durations.push(durId);
      }
    });
    return durations;
  }

  function getDurationLabel(durId) {
    var groups = document.querySelectorAll('[data-duration-id="' + durId + '"][data-duration-label]');
    for (var i = 0; i < groups.length; i++) {
      var lbl = groups[i].getAttribute('data-duration-label');
      if (lbl) return lbl;
    }
    var buttons = document.querySelectorAll('button[data-duration-id="' + durId + '"][data-label]');
    for (var j = 0; j < buttons.length; j++) {
      var lbl2 = buttons[j].getAttribute('data-label');
      if (lbl2) return lbl2;
    }
    return durId.substring(0, 8);
  }

  function getFirstDurationForCategory(catId) {
    var durs = getDurationsForCategory(catId);
    return durs.length ? durs[0] : null;
  }

  function renderDurationButtons() {
    var containers = document.querySelectorAll('.duration-buttons-container');
    if (!containers.length) return;
    var durs = getDurationsForCategory(activeCategoryId);
    var html = '';
    durs.forEach(function(durId, i) {
      var active = (i === 0) ? 'bg-white text-orange-600 shadow-lg' : 'flex items-center gap-1 text-gray-700 hover:text-orange-600';
      var label = getDurationLabel(durId);
      html += '<button data-duration-id="' + durId + '" data-label="' + label + '" class="duration-btn px-4 py-1.5 rounded-full font-semibold transition-all duration-200 ' + active + '"><span>' + label + '</span></button>';
    });
    containers.forEach(function(c) { c.innerHTML = html; });
    attachDurationHandlers();
    if (durs.length && !durs.includes(activeDurationId)) activeDurationId = durs[0];
    if (durs.length) {
      var btns = document.querySelectorAll('.duration-btn');
      btns.forEach(function(b) {
        if (b.getAttribute('data-duration-id') === activeDurationId) {
          b.classList.add('bg-white', 'text-orange-600', 'shadow-lg');
          b.classList.remove('text-gray-700');
        }
      });
    }
  }

  function updatePlanVisibility() {
    document.querySelectorAll('.plan-group, .mobile-plan-group').forEach(function(group) {
      var catMatch = group.getAttribute('data-category-id') === activeCategoryId;
      var durMatch = group.getAttribute('data-duration-id') === activeDurationId;
      group.style.display = (catMatch && durMatch) ? '' : 'none';
    });
  }

  function attachDurationHandlers() {
    document.querySelectorAll('.duration-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.duration-btn').forEach(function(b) {
          b.classList.remove('bg-white', 'text-orange-600', 'shadow-lg');
          b.classList.add('text-gray-700');
        });
        this.classList.add('bg-white', 'text-orange-600', 'shadow-lg');
        this.classList.remove('text-gray-700');
        activeDurationId = this.getAttribute('data-duration-id');
        updatePlanVisibility();
      });
    });
  }

  document.querySelectorAll('.btn.accordion').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var content = this.nextElementSibling;
      if (content) {
        if (content.classList.contains('max-h-0')) {
          content.classList.remove('max-h-0');
          content.style.maxHeight = content.scrollHeight + 'px';
          this.classList.add('active');
        } else {
          content.classList.add('max-h-0');
          content.style.maxHeight = '0';
          this.classList.remove('active');
        }
      }
    });
  });

  document.querySelectorAll('.category-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.category-tab').forEach(function(b) {
        b.classList.remove('border-primary', 'border-b-4');
        b.classList.add('border-b-4', 'border-neutral-300');
        var span = b.querySelector('span');
        if (span) { span.classList.remove('text-primary'); span.classList.add('text-neutral-400'); }
      });
      this.classList.add('border-primary', 'border-b-4');
      this.classList.remove('border-neutral-300');
      var span = this.querySelector('span');
      if (span) { span.classList.add('text-primary'); span.classList.remove('text-neutral-400'); }
      activeCategoryId = this.getAttribute('data-category-id');
      // Reset duration to first available for this category
      var firstDur = getFirstDurationForCategory(activeCategoryId);
      if (firstDur) activeDurationId = firstDur;
      renderDurationButtons();
      updatePlanVisibility();
    });
  });

  // Initial state
  var defaultCategoryBtn = document.querySelector('.category-tab.border-primary');
  if (defaultCategoryBtn) {
    activeCategoryId = defaultCategoryBtn.getAttribute('data-category-id');
    activeDurationId = getFirstDurationForCategory(activeCategoryId);
    renderDurationButtons();
    updatePlanVisibility();
  }
});
