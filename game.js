window.onload = function () {
    alert("- Aperte a tecla espaço para pular.");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = 800;
    canvas.height = 600;
    document.body.style.backgroundColor = "black";

    const gravityValues = {
        Lua: 0.16,
        Terra: 0.98,
        Marte: 0.38,
        Júpiter: 2.53,
        Saturno: 1.07,
        Urano: 0.89,
        Netuno: 1.14,
        Plutão: 0.06,
        Sol: 27.94
    };
    
    let gravity = gravityValues.Terra;
    const jumpPower = -7.5;

    let stickman = {
        x: canvas.width / 2,
        y: canvas.height - 100,
        vy: 1,
        grounded: true
    };

    function createGravitySelector() {
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = "10px";
        container.style.left = "15px";
        container.style.color = "white";
        container.style.fontSize = "16px";

        for (const planet in gravityValues) {
            const label = document.createElement("label");
            label.style.display = "block";
            
            const checkbox = document.createElement("input");
            checkbox.type = "radio";
            checkbox.name = "gravity";
            checkbox.value = planet;
            if (planet === "Terra") checkbox.checked = true;
            
            checkbox.addEventListener("change", () => {
                gravity = gravityValues[planet];
            });
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(planet));
            container.appendChild(label);
        }
        document.body.appendChild(container);
    }

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && stickman.grounded) {
            stickman.vy = jumpPower;
            stickman.grounded = false;
        }
    });

    function update() {
        stickman.vy += gravity; 
        stickman.y += stickman.vy;
        
        if (stickman.y >= canvas.height - 100) {
            stickman.y = canvas.height - 100;
            stickman.vy = 0;
            stickman.grounded = true;
        }
    }

    function drawStickman(x, y) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y - 20, 10, 0, Math.PI * 2); // Cabeça
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x, y + 20); // Corpo
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x + 15, y); // Braços
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x - 10, y + 40); // Perna esquerda
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x + 10, y + 40); // Perna direita
        ctx.stroke();
    }

    function gameLoop() {
        update();
        drawStickman(stickman.x, stickman.y);
        requestAnimationFrame(gameLoop);
    }

    createGravitySelector();
    gameLoop();
};
