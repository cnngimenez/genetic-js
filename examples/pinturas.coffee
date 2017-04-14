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
    amount = this.userData["solution"]
    for i in [0..(this.userData["denominaciones"].length - 1)]
        if (this.userData["denominaciones"][i] <= amount) and (Math.random() < 0.5)
            # We add a bill depending of a probability.
            # If it is the exact amount, add one.
            # If it is more, add at least one to a maximum depending on a probability
            if this.userData["denominaciones"][i] == amount
                data.push(1)
            else
                max = Math.floor(amount / this.userData["denominaciones"][i])
                data.push(genetic.random_fnc(max,1))
        else
            data.push(0)
        amount -= data[i] * this.userData["denominaciones"][i]

    # Use the rest witht the one denomination
    if amount > 0
        data[0] += amount
    data

genetic.mutate = (entity) ->
    # if Math.random() < 0.25
    console.log('mutation -------------------->')
    index = genetic.random_fnc(this.userData["denominaciones"].length, 0)
    entity[index] = genetic.random_fnc(this.userData["solution"], 0)
    console.log(entity)
    entity


genetic.value_pesos = (entity) ->
    sum = 0
    for elt,i in entity
        den = this.userData["denominaciones"][i]
        if den? and elt?
            sum += elt*den
    return sum

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

genetic.fitness = (entity) ->
    if genetic.value_pesos(entity) != this.userData["solution"]
        return this.userData["solution"] * 10
    else
        sum = 0
        for i in entity
            sum += i
        return sum

genetic.generation = (pop, generation, stats) ->
    # this.fitness(pop[0].entity) > 0
    generation < 10

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
