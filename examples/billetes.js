
var genetic = Genetic.create();

//genetic.optimize = Genetic.Optimize.Maximize;
genetic.optimize = Genetic.Optimize.Minimize;
//genetic.select1 = Genetic.Select1.Fittest;
//genetic.select2 = Genetic.Select2.FittestRandom;

genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;


genetic.seed = function() {

	function randomString(len) {
		var text = [];
		//var charset = "01";
		for(var i=0;i<len;i++)
                        if(Math.random()>0.5)
                            text.push(0);
                        else
                            text.push(1);
		
		return text;
	}
	
	// create random strings that are equal in length to solution
	return randomString(this.userData["conjunto"].length);
};

genetic.mutate = function(entity) {
	
	
	// chromosomal drift
        console.log('mutacion-----------------------')
        console.log(entity);
	var i = Math.floor(Math.random()*entity.length);
        entity[i]=1-entity[i];
	console.log(entity);
        console.log('-----------------------')
        return entity;
};

genetic.crossover = function(mother, father) {

	// two-point crossover
	var len = mother.length;
	var ca = Math.floor(Math.random()*len);
	var cb = Math.floor(Math.random()*len);		
	if (ca > cb) {
		var tmp = cb;
		cb = ca;
		ca = tmp;
	}
	var son =father.slice(0,ca);
        var daughter=mother.slice(0,ca);
        console.log('crossover------------');
        console.log(ca);
        console.log(cb);
        console.log(father);
        console.log(mother);
        
	son=son.concat(mother.slice(ca, cb));
        son=son.concat(father.slice(cb));
	daughter=daughter.concat(father.slice(ca, cb));
        daughter=daughter.concat(mother.slice(cb));
	console.log(son);
        console.log(daughter);
        
        console.log('------------');
        //alert('hola');
	return [son, daughter];
};

genetic.fitness = function(entity) {
	var fitness = 0;
	var suma=0;
	var i;
        var j;
	for (i=0;i<entity.length;++i) {
		// increase fitness for each character that matches
		if (entity[i])
			suma +=this.userData["conjunto"][i] ; // si es correcto
		
		// award fractions of a point as we get warmer
		//fitness += (127-Math.abs(entity.charCodeAt(i) - this.userData["solution"].charCodeAt(i)))/50;
                 
	}
        fitness=Math.abs(suma-this.userData["solution"]);
	return fitness;
};

genetic.generation = function(pop, generation, stats) {
	// stop running once we've reached the solution
	//return pop[0].entity != this.userData["solution"];
        return this.fitness(pop[0].entity)>0;
};

genetic.notification = function(pop, generation, stats, isFinished) {

	function lerp(a, b, p) {
		return a + (b-a)*p;
	}
	
	var value = pop[0].entity;
	this.last = this.last||value;
	
	//if (pop != 0 && value == this.last)
	//	return;
	
	
	var solution = [];
	var i;
        var poblacion=[];
	for (i=0;i<value.length;++i) {
		var diff = value[i] - this.last[i];
		var style = "background: transparent;";
		if (diff > 0) {
			style = "background: rgb(0,200,50); color: #fff;";
		} else if (diff < 0) {
			style = "background: rgb(0,100,50); color: #fff;";
		}

		solution.push("<span style=\"" + style + "\">" + value[i] + "</span>");
	}
	for (i=0;i<pop.length;++i){
            poblacion.push(pop[i].entity.join("")+'('+pop[i].fitness+')');
        }
        
        
	var buf = "";
	buf += "<tr>";
	buf += "<td>" + generation + "</td>";
	buf += "<td>" + pop[0].fitness + "</td>";
	buf += "<td>" + solution.join("") + "</td>";
        buf += "<td>" + poblacion.join(",") + "</td>";
	buf += "</tr>";
	$("#results tbody").prepend(buf);
	
	this.last = value;
};


$(document).ready(function () {
	$("#solve").click(function () {
		
		$("#results tbody").html("");
		
		var config = {
			"iterations": 4000
			, "size": 20
			, "crossover": 0.5
			, "mutation": 0.3
			, "skip": 20
		};

		var userData = {
			"solution": $("#quote").val()
                        ,"conjunto":[2,5,6,8,9,22,50]
		};

		genetic.evolve(config, userData);
	});
});
