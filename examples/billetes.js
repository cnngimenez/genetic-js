(function() {
  var genetic;

  genetic = Genetic.create();

  genetic.random_fnc = function(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  genetic.optimize = Genetic.Optimize.Minimize;

  genetic.select1 = Genetic.Select1.Tournament2;

  genetic.select2 = Genetic.Select2.Tournament2;

  genetic.seed = function() {
    var amount, data, i, j, max, ref;
    data = [];
    amount = this.userData["solution"];
    for (i = j = 0, ref = this.userData["denominaciones"].length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      if ((this.userData["denominaciones"][i] <= amount) && (Math.random() < 0.5)) {
        if (this.userData["denominaciones"][i] === amount) {
          data.push(1);
        } else {
          max = Math.floor(amount / this.userData["denominaciones"][i]);
          data.push(genetic.random_fnc(max, 1));
        }
      } else {
        data.push(0);
      }
      amount -= data[i] * this.userData["denominaciones"][i];
    }
    if (amount > 0) {
      data[0] += amount;
    }
    return data;
  };

  genetic.mutate = function(entity) {
    var index;
    console.log('mutation -------------------->');
    index = genetic.random_fnc(this.userData["denominaciones"].length, 0);
    entity[index] = genetic.random_fnc(this.userData["solution"], 0);
    console.log(entity);
    return entity;
  };

  genetic.value_pesos = function(entity) {
    var den, elt, i, j, len, sum;
    sum = 0;
    for (i = j = 0, len = entity.length; j < len; i = ++j) {
      elt = entity[i];
      den = this.userData["denominaciones"][i];
      if ((den != null) && (elt != null)) {
        sum += elt * den;
      }
    }
    return sum;
  };

  genetic.crossover = function(mother, father) {
    var f_fhalf, f_shalf, fh, m_fhalf, m_shalf, mh, offsprings;
    offsprings = [];
    mh = mother.length / 2;
    fh = father.length / 2;
    m_fhalf = mother.slice(0, mh);
    m_shalf = mother.slice(mh, mother.length);
    f_fhalf = father.slice(0, fh);
    f_shalf = father.slice(fh, father.length);
    offsprings.push(m_fhalf.concat(f_shalf));
    offsprings.push(f_fhalf.concat(m_shalf));
    return offsprings;
  };

  genetic.fitness = function(entity) {
    var i, j, len, sum;
    if (genetic.value_pesos(entity) !== this.userData["solution"]) {
      return this.userData["solution"] * 10;
    } else {
      sum = 0;
      for (j = 0, len = entity.length; j < len; j++) {
        i = entity[j];
        sum += i;
      }
      return sum;
    }
  };

  genetic.generation = function(pop, generation, stats) {
    return generation < 10;
  };

  genetic.notification = function(pop, generation, stats, isFinished) {
    var buf, diff, elt, i, j, k, len, len1, poblacion, solution, style, value;
    console.log(pop);
    console.log(generation);
    value = pop[0].entity;
    this.last = this.last || value;
    solution = [];
    poblacion = [];
    for (i = j = 0, len = value.length; j < len; i = ++j) {
      elt = value[i];
      diff = elt - this.last[i];
      style = "background: transparent;";
      if (diff > 0) {
        style = "background: rgb(0,200,50); color: #fff;";
      } else if (diff < 0) {
        style = "background: rgb(0,100,50); color: #fff;";
      }
      solution.push("<span style=\"" + style + "\">" + elt + "</span>");
    }
    for (i = k = 0, len1 = pop.length; k < len1; i = ++k) {
      elt = pop[i];
      poblacion.push(JSON.stringify(elt.entity) + '(' + elt.fitness + ')');
    }
    buf = "";
    buf += "<tr>";
    buf += "<td>" + generation + "</td>";
    buf += "<td>" + pop[0].fitness + "</td>";
    buf += "<td>" + solution.join("") + "</td>";
    buf += "<td>" + poblacion.join(",") + "</td>";
    buf += "</tr>";
    $("#results tbody").prepend(buf);
    return this.last = value;
  };

  $(document).ready(function() {
    return $("#solve").click(function() {
      var config, userData;
      $("#results tbody").html("");
      config = {
        "iterations": 10000,
        "size": 20,
        "crossover": 0.5,
        "mutation": 0.0,
        "skip": 20
      };
      userData = {
        "solution": Number($("#quote").val()),
        "denominaciones": [1, 2, 5, 10, 20, 50, 100, 500]
      };
      console.log("Evolving...");
      return genetic.evolve(config, userData);
    });
  });

  this.genetic = genetic;

}).call(this);
