// ==========================================================
// KONFIGURASI KOIN
// ==========================================================
const COIN_CONFIG = {
	contractAddress: "coming soon",
	chainId: "solana",
	totalSupply: 1000000000,
};

// ==========================================================
// FUNGSI UTAMA
// ==========================================================

/**
 * Update contract address display
 */
function updateContractAddressDisplay() {
	const contractAddressDisplay = document.getElementById(
		"contract-address-display"
	);
	const contractElement = document.getElementById("contract-address");

	if (!contractAddressDisplay) {
		console.log("❌ contract-address-display element not found");
		return;
	}

	const hasContractAddress =
		COIN_CONFIG.contractAddress &&
		COIN_CONFIG.contractAddress.trim() !== "" &&
		COIN_CONFIG.contractAddress !== "coming soon";

	if (hasContractAddress) {
		// Update display element
		contractAddressDisplay.textContent = COIN_CONFIG.contractAddress;
		console.log("✅ CA updated:", COIN_CONFIG.contractAddress);

		// Update hidden element
		if (contractElement) {
			contractElement.textContent = COIN_CONFIG.contractAddress;
		}
	} else {
		// Show "coming soon"
		contractAddressDisplay.textContent = "coming soon";
		if (contractElement) {
			contractElement.textContent = "coming soon";
		}
	}
}

/**
 * Copy contract address to clipboard
 */
function copyContractAddress() {
	const contractAddress = COIN_CONFIG.contractAddress;

	if (
		!contractAddress ||
		contractAddress.trim() === "" ||
		contractAddress === "coming soon"
	) {
		showNotification("Contract address not available yet", "error");
		return;
	}

	navigator.clipboard
		.writeText(contractAddress)
		.then(() => {
			showNotification("Contract address copied to clipboard!", "success");
		})
		.catch(() => {
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = contractAddress;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
			showNotification("Contract address copied to clipboard!", "success");
		});
}

/**
 * Initialize parallax effect for background with cursor tracking
 */
function initParallaxEffect() {
	const parallaxBgs = document.querySelectorAll(".parallax-bg");
	if (parallaxBgs.length === 0) return;

	let ticking = false;
	let mouseX = 0;
	let mouseY = 0;

	function animateParallax() {
		const scrolled = window.pageYOffset;
		const rate = scrolled * -0.5;

		// Calculate cursor-based parallax effect
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const moveX = (mouseX - windowWidth / 2) * 0.02;
		const moveY = (mouseY - windowHeight / 2) * 0.02;

		// Apply parallax effect to all background images
		parallaxBgs.forEach((bg) => {
			bg.style.transform = `scale(1.1) translateY(${rate}px) translateX(${moveX}px) translateY(${moveY}px)`;
		});

		// Apply same parallax effect to overlay with additional static offset
		const overlay = document.querySelector(".primary-gradient-overlay");
		if (overlay) {
			// Convert 10% to pixels for dynamic calculation
			const overlayHeight = overlay.offsetHeight;
			const staticOffset = overlayHeight * 0.1; // 10% of overlay height
			const totalMoveY = moveY + staticOffset;

			overlay.style.transform = `scale(1.1) translateY(${rate}px) translateX(${moveX}px) translateY(${totalMoveY}px)`;
		}

		ticking = false;
	}

	function requestTick() {
		if (!ticking) {
			requestAnimationFrame(animateParallax);
			ticking = true;
		}
	}

	// Track mouse movement
	document.addEventListener("mousemove", (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
		requestTick();
	});

	// Track scroll
	window.addEventListener("scroll", requestTick);
}

/**
 * Initialize hero parallax functionality
 */
function initHeroParallax() {
	const layers = document.querySelectorAll(".parallax-layer");

	if (layers.length === 0) {
		console.warn("⚠️ No parallax layers found");
		return;
	}

	let mouseX = 0;
	let mouseY = 0;
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;

	function updateParallax() {
		const scrolled = window.pageYOffset;

		layers.forEach((layer) => {
			const depth = parseFloat(layer.getAttribute("data-depth") || 0.1);
			const layerClass = layer.className;

			// Calculate mouse parallax effect with different intensities for each layer
			let mouseIntensity = 0.01; // Default for layer 1-2 (no mouse effect)

			if (layerClass.includes("layer-3")) {
				mouseIntensity = 0.05; // Layer 3: medium intensity
			} else if (layerClass.includes("layer-4")) {
				mouseIntensity = 0.08; // Layer 4: higher intensity
			} else if (layerClass.includes("layer-5")) {
				mouseIntensity = 0.12; // Layer 5: highest intensity (paling belakang)
			}

			const mouseParallaxX =
				(mouseX - windowWidth / 2) * depth * mouseIntensity;
			const mouseParallaxY =
				(mouseY - windowHeight / 2) * depth * mouseIntensity;

			// Layer 1.png dan 2.png TIDAK BERGERAK saat scroll
			if (layerClass.includes("layer-1")) {
				// Layer 1: TIDAK BERGERAK
				layer.style.transform = `translateY(0px)`;
			} else if (layerClass.includes("layer-2")) {
				// Layer 2: TIDAK BERGERAK
				layer.style.transform = `translateY(0px)`;
			} else if (layerClass.includes("layer-5")) {
				// Layer 5: BLOKIR GERAKAN KE BAWAH - hanya gerakan horizontal
				const mouseParallaxX = (mouseX - windowWidth / 2) * depth * 0.12;
				layer.style.transform = `translateX(${mouseParallaxX}px) scale(1.3)`;
			} else {
				// Layer 3, 4: bergerak berdasarkan mouse + scroll (normal)
				const yPos = scrolled * depth * 0.5;
				layer.style.transform = `translateY(${yPos}px) translateX(${mouseParallaxX}px) translateY(${mouseParallaxY}px)`;
			}
		});
	}

	// Track mouse movement
	document.addEventListener("mousemove", (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
		updateParallax();
	});

	// Track scroll
	window.addEventListener("scroll", updateParallax);

	// Initial call
	updateParallax();
}

/**
 * Update dynamic links with contract address
 */
function updateDynamicLinks() {
	const buyLink = document.getElementById("buy-link");
	const buyLinkNavbar = document.getElementById("buy-link-navbar");
	const chartLink = document.getElementById("chart-link");

	// Always set links to DexScreener homepage
	if (buyLink) buyLink.href = "https://dexscreener.com";
	if (buyLinkNavbar) buyLinkNavbar.href = "https://dexscreener.com";
	if (chartLink) chartLink.href = "https://dexscreener.com";
	
	console.log("✅ All buy links set to DexScreener homepage");
}

/**
 * Show notification
 */
function showNotification(message, type = "info") {
	const notification = document.createElement("div");
	notification.className = `notification ${type}`;
	notification.innerHTML = `
		<div class="notif-icon">
			<i class="fas fa-${
				type === "success" ? "check" : type === "error" ? "times" : "info"
			}-circle"></i>
		</div>
		<div class="notif-content">
			<p>${message}</p>
		</div>
		<div class="notif-close">
			<i class="fas fa-times"></i>
		</div>
	`;

	document.body.appendChild(notification);

	// Auto remove after 5 seconds with fade out animation
	setTimeout(() => {
		notification.style.opacity = "0";
		notification.style.transform = "translateY(-20px)";
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, 300); // Wait for fade out animation
	}, 5000);

	// Manual close
	notification.querySelector(".notif-close").addEventListener("click", () => {
		if (notification.parentNode) {
			notification.parentNode.removeChild(notification);
		}
	});
}



// ==========================================================
// INITIALIZATION
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
	console.log("🚀 Initializing PENGZ website...");

	// Initialize parallax effects
	initParallaxEffect();
	initHeroParallax();



	// Update CA display immediately
	updateContractAddressDisplay();
	updateDynamicLinks();

	// Update again after delay to ensure AOS doesn't interfere
	setTimeout(() => {
		updateContractAddressDisplay();
		updateDynamicLinks();
	}, 1000);
	setTimeout(() => {
		updateContractAddressDisplay();
		updateDynamicLinks();
	}, 2000);

	console.log("✅ PENGZ website initialized successfully");
});

// Navbar scroll effect
window.addEventListener("DOMContentLoaded", function () {
	const navbar = document.querySelector(".navbar-overlay");
	function handleNavbar() {
		if (window.scrollY === 0) {
			navbar.classList.add("navbar-transparent", "navbar-compact");
		} else {
			navbar.classList.remove("navbar-transparent", "navbar-compact");
		}
	}
	handleNavbar();
	window.addEventListener("scroll", handleNavbar);
});

// Export functions for global access
window.copyContractAddress = copyContractAddress;
window.updateContractAddressDisplay = updateContractAddressDisplay;
window.updateDynamicLinks = updateDynamicLinks;
window.initParallaxEffect = initParallaxEffect;
window.initHeroParallax = initHeroParallax;

