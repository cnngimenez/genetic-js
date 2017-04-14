genetic = Genetic.create()

# Generate a random integer number between max (exclusive) and min(inclusive).
#
# @param max [int]
# @param min [int]
genetic.random_fnc = (max, min) ->
    Math.floor(Math.random() * (max - min)) + min


# genetic.optimize = Genetic.Optimize.Maximize;
genetic.optimize = Genetic.Optimize.Minimize;
# genetic.select1 = Genetic.Select1.Fittest;
# genetic.select2 = Genetic.Select2.FittestRandom;

genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

genetic.seed = () ->
    data = []
    for i in [0..@userData['grafo']['arcs'].length-1]
        colour_index = genetic.random_fnc(@userData['pinturas'].length-1, 0)
        colour = @userData['pinturas'][colour_index]
        data.push(colour)
    data

# We simply change to a random color one random arc.
genetic.mutate = (entity) ->
    console.log('mutation -------------------->')
    colour_index = genetic.random_fnc(@userData["pinturas"].length-1, 0)
    entity_index = genetic.random_fnc(entity.length-1, 0)
    entity[entity_index] = @userData["pinturas"][colour_index]
    console.log(entity)
    entity

genetic.crossover = (mother, father) ->
    offsprings = []
    mh = mother.length/2
    fh = father.length/2
    m_fhalf = mother.slice(0,mh)
    m_shalf = mother.slice(mh,mother.length)
    f_fhalf = father.slice(0,fh)
    f_shalf = father.slice(fh,father.length)

    offsprings.push(m_fhalf.concat(f_shalf))
    offsprings.push(f_fhalf.concat(m_shalf))
    offsprings

# Return the adyacent arcs to the given node.
#
# @return An array of objects with two fields: index and arc.
genetic.adyacent_arcs = (node) ->
    adyacent = []
    for arc,index in @userData['grafo']['arcs']
        if (arc[0] == node) or (arc[1] == node)
            adyacent.push(
                'index': index
                'arc': arc
            )
    adyacent

# For each node, search the adyacent arcs.
# Then, count the adyacent arcs that has the same color.
genetic.fitness = (entity) ->
    # Find node's adyacent arcs
    sum_of_arcs_repeated = 0
    for node in @userData['grafo']['nodes']
        lst_arcs = genetic.adyacent_arcs(node)
        # We take one arc, if the color was used, we add one to repeated, if not
        # we just add the color to the used and take another.
        repeated = 0
        color_used = []
        for arc in lst_arcs
            if color_used.indexOf(entity[arc.index]) < 0
                color_used.push(entity[arc.index])
            else
                repeated += 1
        sum_of_arcs_repeated += repeated
    sum_of_arcs_repeated

# Finish when we find one convination that no arc's colour is repeated.
#
# That's mean fitness is cero.
genetic.generation = (pop, generation, stats) ->
    # this.fitness(pop[0].entity) > 0
    this.fitness(pop[0].entity) > 0

genetic.notification = (pop, generation, stats, isFinished) ->

    console.log(pop)
    console.log(generation)

    value = pop[0].entity
    @last = @last||value

    solution = []
    poblacion = []
    for elt,i in value
        diff = elt - @last[i]
        style = "background: transparent;"
        if diff > 0
            style = "background: rgb(0,200,50); color: #fff;"
        else if diff < 0
            style = "background: rgb(0,100,50); color: #fff;"
        solution.push("<span style=\"" + style + "\">" + elt + "</span>")

    for elt,i in pop
        poblacion.push(
            JSON.stringify(elt.entity) + '(' + elt.fitness + ')')

    buf = ""
    buf += "<tr>"
    buf += "<td>" + generation + "</td>"
    buf += "<td>" + pop[0].fitness + "</td>"
    buf += "<td>" + solution.join("") + "</td>"
    buf += "<td>" + poblacion.join(",") + "</td>"
    buf += "</tr>"
    $("#results tbody").prepend(buf)
    @last = value

$(document).ready( () ->
    $("#solve"). click( () ->
        $("#results tbody").html("")

        config =
            "iterations" : 10000
            "size" : 20
            "crossover": 0.5
            "mutation": 0.0
            "skip": 20

        userData=
            "solution": Number($("#quote").val())
            "pinturas": ["r", "g", "b"]
            "grafo":
              "nodes": [1,2,3,4]
              "arcs": [[1,2], [2,3], [2,4]]

        console.log("Evolving...")
        genetic.evolve(config, userData)

    )
)
