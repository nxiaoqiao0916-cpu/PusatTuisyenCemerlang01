function finishGame() {
  const questions = document.querySelectorAll('.question');
  let totalScore = 0;
  let subjectScores = {};
  let subjectTotals = {};

  // 统计每科总分和得分
  questions.forEach(q => {
    const subject = q.dataset.subject;
    const score = parseInt(q.dataset.score);
    const selected = q.querySelector('input[type="radio"]:checked');

    if(!subjectScores[subject]) { subjectScores[subject]=0; subjectTotals[subject]=0; }
    subjectTotals[subject] += score;
    if(selected && selected.value === "1") subjectScores[subject] += score;

    totalScore += selected && selected.value==="1" ? score : 0;
  });

  // 计算每科百分比
  let subjectsArray = [];
  for(let s in subjectScores){
    let percent = Math.round(subjectScores[s]/subjectTotals[s]*100);
    subjectsArray.push({subject: s, percent});
  }

  // 排序找最弱两科
  subjectsArray.sort((a,b)=>a.percent - b.percent);
  let weakestTwo = subjectsArray.slice(0,2).map(o=>`<span style="color:red">${o.subject}</span>`).join(" & ");

  // 每科百分比显示
  let scoreDetails = subjectsArray.map(o=>`${o.subject}: ${o.percent}%`).join(" | ");

  // 总分百分比
  let maxScore = questions.length ? questions.reduce((sum,q)=>sum+parseInt(q.dataset.score),0) : 100;
  let percentTotal = Math.round(totalScore / maxScore * 100);

  // 星星和鼓励语
  let stars="⭐";
  if(percentTotal>=60) stars="⭐⭐"; 
  if(percentTotal>=80) stars="⭐⭐⭐";

  let msg="💪 没关系，我们一起变强！";
  if(percentTotal>=60) msg="😊 做得不错，继续努力！";
  if(percentTotal>=80) msg="🎉 太棒了！你是学习小英雄！";

  // 显示结果
  document.getElementById('result').innerHTML = `
    <h2>🏁 关卡完成</h2>
    <p>总分：${totalScore}/${maxScore} (${percentTotal}%)</p>
    <p>星星：${stars}</p>
    <p>${msg}</p>
    <p>📌 建议加强：${weakestTwo}</p>
    <p>📊 各科得分：${scoreDetails}</p>
  `;

  // 可选：触发烟花
  if(window.canvas && canvas.getContext){
    let ctx = canvas.getContext('2d');
    let particles = [];
    function createParticles(x,y){
      for(let i=0;i<50;i++){
        particles.push({x,y,vx:(Math.random()-0.5)*6,vy:(Math.random()-0.5)*6,alpha:1,color:`hsl(${Math.random()*360},100%,50%)`});
      }
    }
    function animate(){
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy; p.alpha -=0.02;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x,p.y,3,0,Math.PI*2);
        ctx.fill();
      });
      particles = particles.filter(p=>p.alpha>0);
      if(particles.length>0) requestAnimationFrame(animate);
    }
    createParticles(canvas.width/2, canvas.height/2);
    animate();
  }
}
function goTo(page){
  window.location.href = page;
}
