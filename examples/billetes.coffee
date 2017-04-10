genetic = Genetic.create()

# Generate a random integer number between max (exclusive) and min(inclusive).
#
# @param max [int]
# @param min [int]
genetic.random = (max, min) ->
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
                    data.push(this.random(max,1))
            else
                data.push(0)
            amount -= data[i] * this.userData["denominaciones"][i]

        # Use the rest witht the one denomination
        if amount > 0
            data[0] += amount

        data

genetic.mutate = (entity) ->
    if Math.random() < prob
        index = this.random(this.userData["denominaciones"].length, 0)
        entity[index] = this.random(this.userData["solution"], 0)

genetic.crossover = (mother, father) ->
    offsprings = []
    m_fhalf = mother.slice(0,2)
    m_shalf = mother.slice(2,4)
    f_fhalf = father.slice(0,2)
    f_shalf = father.slice(2,4)
    
    offsprings.push(m_fhalf.concat(f_shalf))
    offsprings.push(f_fhalf.concat(m_shalf))
    offsprings

genetic.fitness = (entity) ->
    sum = 0
    for i in entity
        sum += i
    this.userData["solution"] - sum
    
genetic.generation = (pop, generation, stats) ->
    this.fitness(pop[0].entity) > 0

genetic.notification = (pop, generation, stats, isFinished) ->
    value = pop[0].entity
    @last = @last||value

    solution = []
    poblacion = []
    for i in value
        diff = value[i] - @last[i]
        style = "background: transparent;"
        if diff > 0
            style = "background: rgb(0,200,50); color: #fff;"
        else if diff < 0
            style = "background: rgb(0,100,50); color: #fff;"
        solution.push("<span style=\"" + style + "\">" + value[i] +
    "</span>");

    for i in pop
        poblacion.push(pop[i].entity.json("") + '(' + pop[i].fitness +
        ')')

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
            "iterations" : 4000
            "size" : 20
            "crossover": 0.5
            "mutation": 0.3
            "skip": 20

        userData=
            "solution": $("#quote").val()
            "denominaciones": [1, 2, 5, 10, 20, 50, 100, 500]

        genetic.evolve(config, userData)

    )
)
