window.addEventListener('load', () => {
  const checkbox = document.getElementById('checkbox');
  const contactsName = document.getElementById('contactsName');
  const contactsNumber = document.getElementById('contactsNumber');
  const contactsMail = document.getElementById('contactsMail');
  const checkboxText = document.querySelector('.connection__checkbox-text');
  const contactsBtn = document.getElementById('contactsBtn');
  const inputGoup = [checkbox, contactsName, contactsNumber, contactsMail]

  if (contactsBtn) {
    contactsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let check = 0;
      inputGoup.forEach(item => {
        if (item.id === 'checkbox') {
          if (!item.checked) {
            checkboxText.style.outline = '1px dotted red';
          } else check += 1;
        } else {
          if (!item.value) {
            item.style.outline = '1px solid red'
          } else check += 1;
        }

      })
      if (check === 4) {
        alert('Отправлено')
        inputGoup.forEach(item => {
          if (item.id === 'checkbox') {
            item.checked = false;
          } else item.value = '';
        })
      }
    })
  }

  if (checkbox) {
    checkbox.addEventListener('click', () => {
      checkboxText.style.outline = 'none';
    })
  }

  if (contactsName && contactsNumber && contactsMail) {
    [contactsName, contactsNumber, contactsMail].forEach(item => {
      item.addEventListener('keyup', () => {
        item.style.outline = 'none';
      })
    })
  }
})

