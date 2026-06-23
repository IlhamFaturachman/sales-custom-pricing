document.addEventListener('DOMContentLoaded', function() {
  var activeCategoryId = null;
  var activeDurationId = null;

  var defaultCategoryBtn = document.querySelector('.category-tab.border-primary');
  var defaultDurationBtn = document.querySelector('.duration-btn.bg-white');
  if (defaultCategoryBtn) activeCategoryId = defaultCategoryBtn.getAttribute('data-category-id');
  if (defaultDurationBtn) activeDurationId = defaultDurationBtn.getAttribute('data-duration-id');

  function updatePlanVisibility() {
    document.querySelectorAll('.plan-group, .mobile-plan-group').forEach(function(group) {
      var catMatch = group.getAttribute('data-category-id') === activeCategoryId;
      var durMatch = group.getAttribute('data-duration-id') === activeDurationId;
      group.style.display = (catMatch && durMatch) ? '' : 'none';
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
      updatePlanVisibility();
    });
  });

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
});
