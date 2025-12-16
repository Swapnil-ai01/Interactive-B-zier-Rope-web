const size = document.getElementById("point");
const ctx = size.getContext("2d");
function resize() {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();
function vec(x, y) { return { x, y }; }
function add(a, b) { return vec(a.x + b.x, a.y + b.y); }
function sub(a, b) { return vec(a.x - b.x, a.y - b.y); }
function mul(a, s) { return vec(a.x * s, a.y * s); }
function normalize(v) {
    const len = Math.hypot(v.x, v.y);
    return len === 0 ? vec(0, 0) : vec(v.x / len, v.y / len);
}
let P0 = vec(100, size.height / 2);
let P3 = vec(size.width - 100, size.height / 2);
let P1 = vec(300, size.height / 2 - 150);
let P2 = vec(size.width - 300, size.height / 2 + 150);
let v1 = vec(0, 0);
let v2 = vec(0, 0);
let target = vec(size.width / 2, size.height / 2);
const stiffness = 0.05;
const damping = 0.08;
window.addEventListener("mousemove", e => {
    target.x = e.clientX;
    target.y = e.clientY;
});
function bezier(t, P0, P1, P2, P3) {
    const u = 1 - t;
    const term1 = mul(P0, u * u * u);
    const term2 = mul(P1, 3 * u * u * t);
    const term3 = mul(P2, 3 * u * t * t);
    const term4 = mul(P3, t * t * t);   
    return add(add(term1, term2), add(term3, term4));
}
function bezierTangent(t, P0, P1, P2, P3) {
    const u = 1 - t;
    const term1 = mul(sub(P1, P0), 3 * u * u);
    const term2 = mul(sub(P2, P1), 6 * u * t);
    const term3 = mul(sub(P3, P2), 3 * t * t);   
    return add(add(term1, term2), term3);
}
function updatePointPhysics(pos, vel, targetPos) {
    const displacement = sub(pos, targetPos);
    const springForce = mul(displacement, -stiffness);
    const dampingForce = mul(vel, -damping);
    const acceleration = add(springForce, dampingForce);
    const newVel = add(vel, acceleration);
    const newPos = add(pos, newVel); 
    return { p: newPos, v: newVel };
}
function updatePhysics() {
    const targetP1 = vec(target.x - 50, target.y - 50);
    const targetP2 = vec(target.x + 50, target.y + 50);
    const res1 = updatePointPhysics(P1, v1, targetP1);
    P1 = res1.p;
    v1 = res1.v;
    const res2 = updatePointPhysics(P2, v2, targetP2);
    P2 = res2.p;
    v2 = res2.v;
}
function draw() {
    P0 = vec(100, size.height / 2);
    P3 = vec(size.width - 100, size.height / 2);
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.01) {
        const p = bezier(t, P0, P1, P2, P3);
        if (t === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 4;
    ctx.stroke();
    for (let t = 0; t <= 1; t += 0.1) {
        const p = bezier(t, P0, P1, P2, P3);
        let tan = bezierTangent(t, P0, P1, P2, P3);
        tan = normalize(tan);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + tan.x * 30, p.y + tan.y * 30);
        ctx.strokeStyle = "#ffcc00";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    [P0, P1, P2, P3].forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, i === 0 || i === 3 ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 || i === 3 ? "#ffffff" : "#ff5555";
        ctx.fill();
    });
}
function animate() {
    updatePhysics();
    draw();
    requestAnimationFrame(animate);
}
animate();