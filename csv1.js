	var fs = require('fs');
	var readableStream = fs.createReadStream('FoodFacts.csv');
	var data = '';

	readableStream.on('data', function(chunk) {
		data+=chunk;
	});

	readableStream.on('end', function() {
		var lines=data.split("\n");
		var headers=lines[0].split(",");
		countryIndex = headers.indexOf("countries_en");
		saltIndex = headers.indexOf("salt_100g");
		sugarIndex = headers.indexOf("sugars_100g");
		protienIndex = headers.indexOf("proteins_100g");
		carboIndex = headers.indexOf("carbohydrates_100g");
		fatIndex = headers.indexOf("fat_100g");
		var countryArray = ['Netherlands', 'Canada', 'United Kingdom' , 'United States' , 'Australia' , 'France' , 'Germany' , 'Spain', 'South Africa'];
		var northEurope = ['United Kingdom', 'Denmark', 'Sweden','Norway'];
		var centralEurope  = ['France', 'Belgium', 'Germany', 'Switzerland','Netherlands'];
		var southEurope = ['Portugal', 'Greece', 'Italy', 'Spain', 'Croatia','Albania'];
		var saltArray=new Uint8Array(9);
		var sugarArray=new Uint8Array(9);
		var fatNorth=0;
		var proteinNorth=0;
		var carNorth=0;
		var fatCentral=0;
		var proteinCentral=0;
		var carCentral=0;
		var fatSouth=0;
		var proteinSouth=0;
		var carSouth=0;
		var part1 = [];
		var part2 = [];

		for(var i=1;i<lines.length;i++){
			var currentline=lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
			var flag = countryArray.includes(currentline[countryIndex]);
			var flag1 = northEurope.includes(currentline[countryIndex]);
			var flag2 = centralEurope.includes(currentline[countryIndex]);
			var flag3 = southEurope.includes(currentline[countryIndex]);
			if(flag)
			{
			//console.log(currentline[countryIndex]);
			var index = countryArray.indexOf(currentline[countryIndex]);
			//console.log(index);
			var salt = currentline[saltIndex];
			//console.log(salt);
			var sugar=currentline[sugarIndex];
			//console.log(sugar);
			if(salt=="")
				salt=0;
			if(sugar=="")
				sugar=0;
			saltArray[index] = saltArray[index]+parseFloat(salt);
			sugarArray[index] = sugarArray[index]+parseFloat(sugar);
			flag = false;
		}
		if(flag1)
		{
			var Nfat = currentline[fatIndex];
			var Nprotien=currentline[protienIndex];
			var Ncarbo=currentline[carboIndex];
			if(Nfat=="")
				Nfat=0;
			if(Ncarbo=="")
				Ncarbo=0;
			if(Nprotien=="")
				Nprotien=0;
			fatNorth+=parseFloat(Nfat);
			carNorth+=parseFloat(Ncarbo);
			proteinNorth+=parseFloat(Nprotien);
			flag1=false;
		}
		if(flag2)
		{
			var Cfat = currentline[fatIndex];
			var Cprotien=currentline[protienIndex];
			var Ccarbo=currentline[carboIndex];
			if(Cfat=="")
				Cfat=0;
			if(Cprotien=="")
				Cprotien=0;
			if(Ccarbo=="")
				Ccarbo=0;
			fatCentral+=parseFloat(Cfat);
			proteinCentral+=parseFloat(Cprotien);
			carCentral+=parseFloat(Ccarbo);
			flag2=false;
		}
		if(flag3)
		{
			var Sfat = currentline[fatIndex];
			var Sprotien=currentline[protienIndex];
			var Scarbo=currentline[carboIndex];
			if(Sfat=="")
				Sfat=0;
			if(Sprotien=="")
				Sprotien=0;
			if(Scarbo=="")
				Scarbo=0;
			fatSouth+=parseFloat(Sfat);
			proteinSouth+=parseFloat(Sprotien);
			carSouth+=parseFloat(Scarbo);
			flag3=false;
		}
	}
	for(var i=0;i<countryArray.length;i++)
	{
		var obj = {};
		obj["country"] = countryArray[i];
		obj["salt"] = saltArray[i];
		obj["sugar"] = sugarArray[i];
		part1.push(obj);
	}
	
	var nobj = {};
	nobj["country"] = "NorthEurope";
	nobj["Fat"] = fatNorth;
	nobj["Protien"] = proteinNorth;
	nobj["carbohydrates"] = carNorth;
	part2.push(nobj);

	var cobj= {};
	cobj["country"] = "CentralEurope";
	cobj["Fat"] = fatCentral;
	cobj["Protien"] = proteinCentral;
	cobj["carbohydrates"] = carCentral;
	part2.push(cobj);

	var sobj={};
	sobj["country"] = "southEurope";
	sobj["Fat"] = fatSouth;
	sobj["Protien"] = proteinSouth;
	sobj["carbohydrates"] = carSouth;
	part2.push(sobj);

	fs.writeFile('output/part1.json', JSON.stringify(part1) , 'utf-8');
	fs.writeFile('output/part2.json',JSON.stringify(part2),'utf-8');
});

