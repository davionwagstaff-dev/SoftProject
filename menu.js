
  const categories = document.querySelectorAll('.category');
  const sections = document.querySelectorAll('.menuSection');

  categories.forEach(category => {
    category.addEventListener('click', () => {
      const targetId = category.getAttribute('data-target');

    
      sections.forEach(section => section.classList.add('hidden'));

    
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }); 
  });    
