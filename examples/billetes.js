(function() {
  var genetic;

  genetic = Genetic.create();

  genetic.random = function(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  genetic.optimize = Genetic.Optimize.Minimize;

  genetic.select1 = Genetic.Select1.Tournament2;

  genetic.select2 = Genetic.Select2.Tournament2;

  genetic.seed = function() {
    var amount, data, i, j, max, ref, results;
    data = [];
    amount = this.userData["solution"];
    results = [];
    for (i = j = 0, ref = this.userData["denominaciones"].length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      if ((this.userData["denominaciones"][i] <= amount) && (Math.random() < 0.5)) {
        if (this.userData["denominaciones"][i] === amount) {
          data.push(1);
        } else {
          max = Math.floor(amount / this.userData["denominaciones"][i]);
          data.push(this.random(max, 1));
        }
      } else {
        data.push(0);
      }
      amount -= data[i] * this.userData["denominaciones"][i];
      if (amount > 0) {
        data[0] += amount;
      }
      results.push(data);
    }
    return results;
  };

  genetic.mutate = function(entity) {
    var index;
    if (Math.random() < prob) {
      index = this.random(this.userData["denominaciones"].length, 0);
      return entity[index] = this.random(this.userData["solution"], 0);
    }
  };

  genetic.crossover = function(mother, father) {
    var f_fhalf, f_shalf, m_fhalf, m_shalf, offsprings;
    offsprings = [];
    m_fhalf = mother.slice(0, 2);
    m_shalf = mother.slice(2, 4);
    f_fhalf = father.slice(0, 2);
    f_shalf = father.slice(2, 4);
    offsprings.push(m_fhalf.concat(f_shalf));
    offsprings.push(f_fhalf.concat(m_shalf));
    return offsprings;
  };

  genetic.fitness = function(entity) {
    var i, j, len, sum;
    sum = 0;
    for (j = 0, len = entity.length; j < len; j++) {
      i = entity[j];
      sum += i;
    }
    return this.userData["solution"] - sum;
  };

  genetic.generation = function(pop, generation, stats) {
    return this.fitness(pop[0].entity) > 0;
  };

  genetic.notification = function(pop, generation, stats, isFinished) {};

  $(document).ready(function() {
    return $("#solve").click(function() {
      var config, userData;
      $("#results tbody").html("");
      config = {
        "iterations": 4000,
        "size": 20,
        "crossover": 0.5,
        "mutation": 0.3,
        "skip": 20
      };
      userData = {
        "solution": $("#quote").val(),
        "denominaciones": [1, 2, 5, 10, 20, 50, 100, 500]
      };
      return genetic.evolve(config, userData);
    });
  });

}).call(this);
