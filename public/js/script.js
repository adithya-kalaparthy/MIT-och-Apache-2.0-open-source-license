//console.log("test adithya")

window.addEventListener("DOMContentLoaded", async () => {
	let waitingForCandidates = true;

	const api_url = new URL('https://broadcaster.lab.sto.eyevinn.technology:8443/broadcaster/channel/sthlm');
	let payload = {};
	let options = {
		"method": "POST",
		"headers": { "Content-Type": "application/json" },
		"body": JSON.stringify(payload)
	}

	const peer = new RTCPeerConnection({
		iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
	});

	peer.onicegatheringstatechange = async () => {
		if (peer.iceGatheringState === "complete") {
			await iceGatheringComplete();
		}
	};


	peer.addEventListener('track', async (event) => {
		const player = document.getElementById('player');
		const [remoteStream] = event.streams;
		//console.log(remoteStream);
		player.srcObject = remoteStream;
	});
	

	const response = await fetch(api_url, options);
	const data = await response.json();
	//console.log(data);
	const viewerResourceUrl = response.headers.get("location");
	//console.log(viewerResourceUrl);

	await peer.setRemoteDescription({ type: "offer", sdp: data.offer });
	const answer = peer.createAnswer();
	await peer.setLocalDescription(answer);

	peer.onicecandidate = async (event) => {
		peer.addIceCandidate(event.candidate);
		if (event.candidate !== null) {
			await sendCandidateToRemotePeer(event.candidate);
		}
	};

	async function iceGatheringComplete() {
		waitingForCandidates = false;
		clearTimeout(iceGatheringTimeout);
		let vidoeoptions = {
			method: "PUT",
			headers: { "Content-Type": "application/whpp+json" },
			body: JSON.stringify({ answer: peer.localDescription.sdp })
		}
		const videoresponse = await fetch(viewerResourceUrl, vidoeoptions);
	}

	async function sendCandidateToRemotePeer(icecandidate) {
		let patchoptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/whpp+json" },
			body: JSON.stringify({ candidate: icecandidate })
		}
		const iceresponse = fetch(viewerResourceUrl, patchoptions);
		console.log(icecandidate);
    }

	const iceGatheringTimeout = setTimeout(async () => { await iceGatheringComplete(); }, 5000);

});
