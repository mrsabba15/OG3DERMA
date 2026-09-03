const menuBtn = document.getElementById('menuBtn');
const toc = document.getElementById('toc');

if (menuBtn && toc) {
  menuBtn.addEventListener('click', () => toc.classList.toggle('open'));
  toc.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => toc.classList.remove('open'));
  });
}

const sections = Array.from(document.querySelectorAll('section[id]'));
const dotnav = document.getElementById('dotnav');

if (dotnav) {
  sections.forEach((sec) => {
    const label = sec.querySelector('h1,h2')?.textContent.trim() || sec.id;
    const dot = document.createElement('button');
    dot.dataset.target = sec.id;
    const tip = document.createElement('span');
    tip.className = 'tip';
    tip.textContent = label;
    dot.appendChild(tip);
    dot.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth' }));
    dotnav.appendChild(dot);
  });
}

const dots = Array.from(document.querySelectorAll('.dotnav button'));
const tocLinks = Array.from(document.querySelectorAll('.toc a'));

if (sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach((d) => d.classList.toggle('active', d.dataset.target === id));
        tocLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.5 });

  sections.forEach((sec) => observer.observe(sec));
}

document.querySelectorAll('.back-top').forEach((btn) => {
  btn.addEventListener('click', () => {
    const hero = document.getElementById('hero');
    if (hero) hero.scrollIntoView({ behavior: 'smooth' });
  });
});

const batchDB = {
  OG3BC2406: { mfg: 'June 2024', use: 'May 2026', qty: '50 ml', mrp: '₹249/- (Incl. of all taxes)', genuine: true },
  OG3BC2501: { mfg: 'January 2025', use: 'December 2026', qty: '50 ml', mrp: '₹249/- (Incl. of all taxes)', genuine: true },
  OG3BC2503: { mfg: 'March 2025', use: 'February 2027', qty: '100 ml', mrp: '₹399/- (Incl. of all taxes)', genuine: true }
};

const batchBtn = document.getElementById('batchBtn');
const batchInput = document.getElementById('batchInput');
const batchResult = document.getElementById('batchResult');

if (batchBtn && batchInput && batchResult) {
  batchBtn.addEventListener('click', () => {
    const val = batchInput.value.trim().toUpperCase();
    const info = batchDB[val];

    if (!val) return;

    if (info) {
      batchResult.className = 'batch-result show';
      batchResult.innerHTML = `
        <div class="batch-row"><span>Batch No.</span><span>${val}</span></div>
        <div class="batch-row"><span>Mfg. Date</span><span>${info.mfg}</span></div>
        <div class="batch-row"><span>Use Before</span><span>${info.use}</span></div>
        <div class="batch-row"><span>Net Quantity</span><span>${info.qty}</span></div>
        <div class="batch-row"><span>MRP</span><span>${info.mrp}</span></div>
        <div class="batch-status">✓ This batch is genuine & safe to use.</div>`;
    } else {
      batchResult.className = 'batch-result show invalid';
      batchResult.innerHTML = '<div class="batch-status bad">✕ We couldn\'t verify this batch number. Please contact support with your batch code and purchase details.</div>';
    }
  });
}

document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');

  if (q && a) {
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((i) => {
        i.classList.remove('open');
        const faqA = i.querySelector('.faq-a');
        if (faqA) faqA.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  }
});

let rating = 0;
const starBtns = document.querySelectorAll('#stars button');
starBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    rating = parseInt(btn.dataset.v, 10);
    starBtns.forEach((b) => b.classList.toggle('on', parseInt(b.dataset.v, 10) <= rating));
  });
});

const emailRecipient = 'og3derma.in@gmail.com';

async function sendDirectEmail(subject, body) {
  try {
    const response = await fetch('https://formsubmit.co/ajax/' + emailRecipient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _captcha: 'false',
        _template: 'table',
        message: body,
        email: emailRecipient
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    const mailtoLink = `mailto:${emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    return false;
  }
}

const submitReview = document.getElementById('submitReview');
const reviewText = document.getElementById('reviewText');
const reviewConfirm = document.getElementById('reviewConfirm');

if (submitReview && reviewText && reviewConfirm) {
  submitReview.addEventListener('click', async () => {
    const reviewMessage = reviewText.value.trim();
    const ratingText = rating ? `${rating} / 5 stars` : 'No rating selected';
    const subject = 'Customer Review Submission';
    const body = reviewMessage
      ? `Customer Review\n\nRating: ${ratingText}\nReview: ${reviewMessage}`
      : `Customer Review\n\nRating: ${ratingText}\nReview: No review provided.`;

    await sendDirectEmail(subject, body);

    reviewConfirm.classList.add('show');
    reviewText.value = '';
    starBtns.forEach((btn) => btn.classList.remove('on'));
    rating = 0;
    setTimeout(() => reviewConfirm.classList.remove('show'), 4000);
  });
}

const submitReport = document.getElementById('submitReport');
const issueDetail = document.getElementById('issueDetail');
const reportConfirm = document.getElementById('reportConfirm');
const reportRadios = document.querySelectorAll('input[name="issue"]');

if (submitReport && issueDetail && reportConfirm) {
  submitReport.addEventListener('click', async () => {
    const selectedIssue = Array.from(reportRadios).find((radio) => radio.checked)?.value || 'Not selected';
    const detail = issueDetail.value.trim();
    const subject = 'Product Issue Report';
    const body = `Customer Issue Report\n\nSelected issue: ${selectedIssue}\nDetails: ${detail || 'No additional details provided.'}`;

    await sendDirectEmail(subject, body);

    reportConfirm.classList.add('show');
    issueDetail.value = '';
    reportRadios.forEach((radio) => {
      radio.checked = false;
    });
    setTimeout(() => reportConfirm.classList.remove('show'), 4500);
  });
}
