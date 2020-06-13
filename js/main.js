var myMap = L.map("mapid").setView([0, 0], 3);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

async function asyncGetData() {
	const data = await fetch("https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest");
	const result = await data.json();
	return result;
}

async function asyncRenderData() {
	const data = await asyncGetData();
	data.forEach(element => {
		let country =
			element.provincestate === ""
				? element.countryregion
				: `${element.provincestate} (${element.countryregion})`;
		const marker = L.marker([element.location.lat, element.location.lng]).addTo(myMap).bindPopup(`
			<strong>${country}</strong>
			<p style="color:orange;">Confirmados: <strong>${element.confirmed}</strong><p>
			<p style="color:red;">Fallecidos: <strong>${element.deaths}</strong><p>
			<p style="color:green;">Recuperados: <strong>${element.recovered}</strong><p>
			`);
		marker.on("mouseover", function() {
			this.openPopup();
		});
		marker.on("mouseout", function() {
			this.closePopup();
		});
	});
}

asyncRenderData();