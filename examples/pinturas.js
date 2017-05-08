(function() {
  this.genetic = Genetic.create();

  genetic.random_fnc = function(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  genetic.optimize = Genetic.Optimize.Minimize;

  genetic.select1alg = Genetic.Select1.Tournament2;

  genetic.select2alg = Genetic.Select2.Tournament2;

  genetic.select1 = function(pop) {
    var elt, j, len, selected, str;
    selected = genetic.select1alg(pop);
    console.log("|-- Selection 1 --|");
    str = "";
    for (j = 0, len = selected.length; j < len; j++) {
      elt = selected[j];
      str += elt + " | ";
    }
    console.log(str);
    return selected;
  };

  genetic.select2 = function(pop) {
    var elt, j, len, selected, str;
    selected = genetic.select2alg(pop);
    console.log("|-- Selection 2 --|");
    str = "";
    for (j = 0, len = selected.length; j < len; j++) {
      elt = selected[j];
      str += elt + " | ";
    }
    console.log(str);
    return selected;
  };

  genetic.seed = function() {
    var colour, colour_index, data, i, j, ref;
    data = [];
    for (i = j = 0, ref = this.userData['grafo']['arcs'].length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      colour_index = genetic.random_fnc(this.userData['pinturas'].length, 0);
      colour = this.userData['pinturas'][colour_index];
      data.push(colour);
    }
    return data;
  };

  genetic.mutate = function(entity) {
    var colour_index, entity_index;
    console.log('      |-- mutation --|');
    colour_index = genetic.random_fnc(this.userData["pinturas"].length, 0);
    entity_index = genetic.random_fnc(entity.length, 0);
    entity[entity_index] = this.userData["pinturas"][colour_index];
    console.log('    ' + String(entity));
    return entity;
  };

  genetic.crossover = function(mother, father) {
    var f_fhalf, f_shalf, fh, m_fhalf, m_shalf, mh, offsprings;
    console.log('    |-- crossover --|');
    console.log('   ' + mother + " <-> " + father);
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

  genetic.adyacent_arcs = function(node) {
    var adyacent, arc, index, j, len, ref;
    adyacent = [];
    ref = this.userData['grafo']['arcs'];
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      arc = ref[index];
      if ((arc[0] === node) || (arc[1] === node)) {
        adyacent.push({
          'index': index,
          'arc': arc
        });
      }
    }
    return adyacent;
  };

  genetic.fitness = function(entity) {
    var arc, color_used, j, k, len, len1, lst_arcs, node, ref, repeated, sum_of_arcs_repeated;
    sum_of_arcs_repeated = 0;
    ref = this.userData['grafo']['nodes'];
    for (j = 0, len = ref.length; j < len; j++) {
      node = ref[j];
      lst_arcs = genetic.adyacent_arcs(node);
      repeated = 0;
      color_used = [];
      for (k = 0, len1 = lst_arcs.length; k < len1; k++) {
        arc = lst_arcs[k];
        if (color_used.indexOf(entity[arc.index]) < 0) {
          color_used.push(entity[arc.index]);
        } else {
          repeated += 1;
        }
      }
      sum_of_arcs_repeated += repeated;
    }
    return sum_of_arcs_repeated;
  };

  genetic.generation = function(pop, generation, stats) {
    return this.fitness(pop[0].entity) > 0;
  };

  genetic.notification = function(pop, generation, stats, isFinished) {
    var buf, diff, elt, i, j, k, len, len1, poblacion, solution, style, value;
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
    this.last = value;
    console.log('__________________________________________________');
    return console.log('Generation: ' + generation);
  };

  $(document).ready(function() {
    return $("#solve").click(function() {
      $("#results tbody").html("");
      this.config = {
        "iterations": 4000,
        "size": 20,
        "crossover": 0.5,
        "mutation": 0.25,
        "skip": 20
      };
      this.userData = {
        "solution": Number($("#quote").val()),
        "pinturas": ["r", "g", "b"],
        "grafo": {
          "nodes": [1, 2, 3, 4],
          "arcs": [[1, 2], [2, 3], [2, 4], [3, 4], [4, 1]]
        }
      };
      console.log("Evolving...");
      return genetic.evolve(this.config, this.userData);
    });
  });

}).call(this);
