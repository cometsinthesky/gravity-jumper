window.onload = function () {
    alert("- Aperte a tecla espaço para pular. Coloque no modo Tela Cheia (F11).");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = 800;
    canvas.height = 800;
    canvas.style.position = 'fixed';  // Garante que o canvas não se mova com o scroll
    canvas.style.zIndex = 9999;  // Define que o canvas ficará sobre outros elementos
    document.body.style.backgroundColor = "black";

    const gravityValues = {
        Lua: 0.16,
        Terra: 0.98,
        Mercúrio: 0.38,
        Vênus: 0.91,
        Marte: 0.38,
        Júpiter: 2.53,
        Saturno: 1.07,
        Urano: 0.89,
        Netuno: 1.14,
        Plutão: 0.06,
        Sol: 27.94,
    };
    
    let gravity = gravityValues.Terra;
    const jumpPower = -8;

    let stickman = {
        x: canvas.width / 2,
        y: canvas.height - 100,
        vy: 1,
        grounded: true
    };

    function createGravitySelector() {
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = "2vh";
        container.style.left = "1vw";
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
        
        if (stickman.y >= canvas.height - 150) {
            stickman.y = canvas.height - 150;
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
        
        // Braços: se estiver no chão, os braços estão para baixo, se estiver pulando, os braços estão para cima
        if (stickman.vy < 0) { // Durante o pulo, braços para cima
            ctx.moveTo(x - 10, y - 10); // Braço esquerdo
            ctx.lineTo(x - 20, y - 25); // Braço esquerdo para cima
            ctx.moveTo(x + 10, y - 10); // Braço direito
            ctx.lineTo(x + 20, y - 25); // Braço direito para cima
        } else { // Quando no solo, braços para baixo
            ctx.moveTo(x - 10, y); // Braço esquerdo
            ctx.lineTo(x - 20, y + 10); // Braço esquerdo para baixo
            ctx.moveTo(x + 10, y); // Braço direito
            ctx.lineTo(x + 20, y + 10); // Braço direito para baixo
        }
        
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x - 10, y + 40); // Perna esquerda
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x + 10, y + 40); // Perna direita
        ctx.stroke();
    }

    function drawArrow(x, y, length, color, direction = "up") {
        // Desenha um vetor com estilo de flecha
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        if (direction === "up") {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - length); // Linha para cima
            // Desenhando a ponta da flecha
            ctx.moveTo(x - 5, y - length + 5);
            ctx.lineTo(x, y - length);
            ctx.lineTo(x + 5, y - length + 5);
        } else if (direction === "down") {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + length); // Linha para baixo
            // Desenhando a ponta da flecha
            ctx.moveTo(x - 5, y + length - 5);
            ctx.lineTo(x, y + length);
            ctx.lineTo(x + 5, y + length - 5);
        }
        ctx.stroke();
    }

    function drawVectors(x, y) {
        // Vetor da aceleração da gravidade (vermelho)
        const gravityVectorLength = Math.abs(stickman.vy) * 5; // Multiplicamos para visualizar a aceleração
        drawArrow(x, y, gravityVectorLength, "red", "down");
    }

    function gameLoop() {
        update();
        drawStickman(stickman.x, stickman.y);
        drawVectors(stickman.x, stickman.y);
        requestAnimationFrame(gameLoop);
    }

    createGravitySelector();
    gameLoop();
};
