function decode(str) {
    return atob(str);
}

const VALID_USER = decode("U2FkaGFuYTIwMjY=");
const VALID_PASS = decode("TUNBQDIwMjY=");

window.addEventListener("DOMContentLoaded",()=>{
    document.getElementById("rulesPopup").style.display="flex";
});

function closeRules(){
    document.getElementById("rulesPopup").style.display="none";
}

function captureLoginData(event){
    event.preventDefault();

    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value.trim();

    if(username===VALID_USER && password===VALID_PASS){
        sessionStorage.setItem("loggedIn","true");
        window.location.href="form.html";
    }else{
        document.getElementById("error-message").textContent =
        "Invalid username or password";
    }

    return false;
}

/* Interactive Dot Grid */
const canvas=document.getElementById("dotCanvas");
const ctx=canvas.getContext("2d");

let dots=[];
const spacing=35;
const mouse={x:-1000,y:-1000};

function resize(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    dots=[];

    for(let y=0;y<canvas.height;y+=spacing){
        for(let x=0;x<canvas.width;x+=spacing){
            dots.push({
                x,y,
                ox:x,
                oy:y,
                vx:0,
                vy:0
            });
        }
    }
}

window.addEventListener("resize",resize);
resize();

window.addEventListener("mousemove",e=>{
    mouse.x=e.clientX;
    mouse.y=e.clientY;
});

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    dots.forEach(dot=>{

        const dx=dot.x-mouse.x;
        const dy=dot.y-mouse.y;
        const dist=Math.sqrt(dx*dx+dy*dy);

        if(dist<120){
            const force=(120-dist)/120;

            dot.vx+=(dx/dist)*force*2;
            dot.vy+=(dy/dist)*force*2;
        }

        dot.vx+=(dot.ox-dot.x)*0.02;
        dot.vy+=(dot.oy-dot.y)*0.02;

        dot.vx*=0.92;
        dot.vy*=0.92;

        dot.x+=dot.vx;
        dot.y+=dot.vy;

        ctx.beginPath();
        ctx.arc(dot.x,dot.y,2,0,Math.PI*2);

        ctx.shadowBlur = 10;
        ctx.shadowColor = "#FFD700";

        ctx.fillStyle = "#FFD700";
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

animate();