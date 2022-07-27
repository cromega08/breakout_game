const 	blocks_sec = document.getElementById("blocks_sec"),
		user_sec = document.getElementById("user_sec"),
		user_block = document.createElement("div"),
		ball = document.createElement("div"),
		blocks_array = [],
		positions_array = [],
		page_width = window.innerWidth,
		page_height = window.innerHeight

let user_pos = 0, ball_pos = [0, 0], ball_dir, ball_timer

create_user()
create_blocks()
create_ball()

function create_user() {
	user_block.setAttribute("class", "user_block")
	user_sec.appendChild(user_block)
	document.addEventListener("keydown", move_user)
}

function move_user(e) {
	switch(e.key) {
		case "ArrowLeft":
			if (user_pos <= -32) return;
			user_block.style.left = `${user_pos-=2}vw`; break
		case "ArrowRight":
			if (user_pos >= 32) return;
			user_block.style.left = `${user_pos+=2}vw`; break
	}
}

function create_blocks() {
	let block
	for (let index = 0; index < 45; ++index) {
		block = document.createElement("div")
		block.setAttribute("class", random_blocks_width())
		block.setAttribute("data-id", index)
		blocks_sec.appendChild(block)
		blocks_array.push(block)
	}
	set_positions_array(blocks_array)
}

function set_positions_array(array = Array) {
	let properties, block
	for (let index = 0; index < array.length; ++index) {
		block = array[index].getBoundingClientRect()
		properties = {
			top: Math.abs((block.top/page_height * 100) - 100),
			left: Math.abs(block.left/page_width * 100),
			bottom: Math.abs((block.bottom/page_height * 100) - 100),
			right: Math.abs(block.right/page_width * 100)
		}
		positions_array.push(properties)
	}
}

function random_blocks_width() {
	const type = Math.floor(Math.random() * 4)
	switch(type) {
		case 0: return "block_0";
		case 1: return "block_1";
		case 2: return "block_2";
		case 3: return "block_3";
		default: console.log("An internal error ocurred while defining the width of the blocks");
	}
}

function create_ball() {
	ball.setAttribute("class", "ball")
	ball.style.left = random_ball_pos()
	ball.style.bottom = "30vh"
	ball_pos[0] = +ball.style.left.slice(0, -2)
	ball_pos[1] = +ball.style.bottom.slice(0, -2)
	user_sec.appendChild(ball)
	ball_timer = setInterval(move_ball, 25)
}

function random_ball_pos() {
	const pos = Math.floor(Math.random() * 4)
	start_ball_pos = pos
	switch (pos) {
		case 0: ball_dir = 3; return "37.5vw"
		case 1: ball_dir = 3; return "43.5vw"
		case 2: ball_dir = 2; return "55vw"
		case 3: ball_dir = 2; return "61vw"
		default: console.log("An internal error ocurred while setting ball position");
	}
}

function move_ball() {
	check_collitions()
	switch (ball_dir) {
		case 0:
			ball.style.left = `${ball_pos[0] += 0.5}vw`
			ball.style.bottom = `${ball_pos[1] += 0.5}vh`
			break
		case 1:
			ball.style.left = `${ball_pos[0] -= 0.5}vw`
			ball.style.bottom = `${ball_pos[1] += 0.5}vh`
			break
		case 2:
			ball.style.left = `${ball_pos[0] -= 0.5}vw`
			ball.style.bottom = `${ball_pos[1] -= 0.5}vh`
			break
		case 3:
			ball.style.left = `${ball_pos[0] += 0.5}vw`
			ball.style.bottom = `${ball_pos[1] -= 0.5}vh`
			break
		default: break
	}
}

function check_collitions() {
	wall_collitions()
	ball_pos[1] < 46? user_collition():block_collition()
}

function wall_collitions() {
	switch (ball_dir) {
		case 0:
			if (ball_pos[0] >= 87.5) {ball_dir = 1}
			if (ball_pos[1] >= 84.5) {ball_dir = 3}
 			break;
		case 1:
			if (ball_pos[0] <= 9.5) {ball_dir = 0}
			if (ball_pos[1] >= 84.5) {ball_dir = 2}
 			break;
		case 2:
			if (ball_pos[0] <= 9.5) {ball_dir = 3}
			if (ball_pos[1] <= 7) {endgame()}
 			break;
		case 3:
			if (ball_pos[0] >= 87.5) {ball_dir = 2}
			if (ball_pos[1] <= 7 ) {endgame()}
 			break;
		default: break;
	}
}

function user_collition() {
	const validation = [ball_pos[1] > 17, ball_pos[1] < 20.5,
						ball_pos[0] > user_pos + 42, ball_pos[0] < user_pos + 58]

	if (validation.every(element => element === true)) {
		switch (ball_dir) {
			case 2: ball_dir = 1; break
			case 3: ball_dir = 0; break
			default: break;
		}
	}
}

function block_collition() {
	const position = ball.getBoundingClientRect(),
			collition = {
				top: Math.abs((position.top/page_height * 100) - 100),
				left: Math.abs(position.left/page_width * 100),
				bottom: Math.abs((position.bottom/page_height * 100) - 100),
				right: Math.abs(position.right/page_width * 100)
			}
	let block
	for (let index = 0; index < positions_array.length; ++index) {
		if (blocks_array[index] === null) continue;
		block = positions_array[index]
		if (block.top >= collition.bottom &&
			block.left <= collition.right - 0.5 &&
			block.bottom <= collition.top &&
			block.right >= collition.left - 0.5) {
				console.log(block, collition);
				switch (ball_dir) {
					case 0: ball_dir = block.left >= collition.right && block.bottom <= collition.top? 1:3; break
					case 1: ball_dir = block.right <= collition.left && block.bottom <= collition.top? 0:2; break
					case 2: ball_dir = block.right <= collition.left && block.top >= collition.bottom? 3:1; break
					case 3: ball_dir = block.left <= collition.right && block.top >= collition.bottom? 2:0; break
					default:
						break;
				}
				blocks_array[index].style.borderColor = "transparent"
				blocks_array[index].style.backgroundColor = "transparent"
				blocks_array[index] = null
			}
	}
	victory()
}

function victory() {blocks_array.every(block => {block === null})? alert("You win"):null}

function endgame() {
	clearInterval(ball_timer)
	alert("You Lose")
}
