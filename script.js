/* ===== Auto-email setup =====
     The form below emails enquiries to Deepak using Web3Forms (free).
     1) Go to https://web3forms.com  ->  enter Deepak's email  ->  copy the Access Key.
     2) Paste it between the quotes on the next line.
     Until a real key is added, the form falls back to opening WhatsApp.        */
  const WEB3FORMS_ACCESS_KEY = "YOUR-WEB3FORMS-ACCESS-KEY";

  document.getElementById('yr').textContent = new Date().getFullYear();

  const menuBtn=document.getElementById('menuBtn'), navlinks=document.getElementById('navlinks');
  menuBtn.addEventListener('click',()=>{const o=navlinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',o);});
  navlinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navlinks.classList.remove('open');menuBtn.setAttribute('aria-expanded',false);}));

  let reqType='a Flat';
  const pickers=document.getElementById('pickers');
  function setType(val){pickers.querySelectorAll('.pick').forEach(p=>p.setAttribute('aria-pressed', p.dataset.val===val));reqType=val;}
  pickers.addEventListener('click',e=>{const b=e.target.closest('.pick');if(b)setType(b.dataset.val);});

  // hero quick chips -> preset type + scroll to form
  document.querySelectorAll('.qchip').forEach(c=>c.addEventListener('click',()=>{
    setType(c.dataset.q);
    document.getElementById('enquiry').scrollIntoView({behavior:'smooth'});
  }));

  const g=id=>(document.getElementById(id).value||'').trim();
  function buildMessage(){
    let m=`Hi Deepak, I'm looking for ${reqType} in/around Kalina.`;
    if(g('f-name'))m+=`\nName: ${g('f-name')}`;
    if(g('f-phone'))m+=`\nPhone: ${g('f-phone')}`;
    if(g('f-area'))m+=`\nArea / budget: ${g('f-area')}`;
    if(g('f-msg'))m+=`\nNotes: ${g('f-msg')}`;
    return m;
  }
  function showMsg(text,ok){const el=document.getElementById('formMsg');el.textContent=text;el.className='form-msg '+(ok?'ok':'err');}

  document.getElementById('sendWa').addEventListener('click',()=>window.open('https://wa.me/919820400064?text='+encodeURIComponent(buildMessage()),'_blank','noopener'));

  document.getElementById('sendEnq').addEventListener('click',async()=>{
    if(!g('f-name')||!g('f-phone')){showMsg('Please add your name and phone number.',false);return;}
    // No key yet -> use WhatsApp so the enquiry still reaches Deepak
    if(WEB3FORMS_ACCESS_KEY==="YOUR-WEB3FORMS-ACCESS-KEY"){
      window.open('https://wa.me/919820400064?text='+encodeURIComponent(buildMessage()),'_blank','noopener');
      showMsg('Opening WhatsApp. (Add a Web3Forms key to email enquiries automatically.)',true);
      return;
    }
    const btn=document.getElementById('sendEnq');const orig=btn.textContent;btn.textContent='Sending…';btn.disabled=true;
    try{
      const res=await fetch('https://api.web3forms.com/submit',{
        method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify({
          access_key:WEB3FORMS_ACCESS_KEY,
          subject:'New website enquiry — '+reqType,
          from_name:g('f-name')||'Website enquiry',
          looking_for:reqType, name:g('f-name'), phone:g('f-phone'),
          area_budget:g('f-area'), message:g('f-msg')
        })
      });
      const data=await res.json();
      if(data.success){showMsg('Thanks! Your enquiry has been sent to Deepak.',true);
        ['f-name','f-phone','f-area','f-msg'].forEach(id=>document.getElementById(id).value='');}
      else{showMsg('Could not send right now — please WhatsApp or call instead.',false);}
    }catch(e){showMsg('Could not send right now — please WhatsApp or call instead.',false);}
    finally{btn.textContent=orig;btn.disabled=false;}
  });

  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
