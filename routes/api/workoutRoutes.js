const router = require("express").Router();
const { Workout } = require("../../models");

router.get("/workouts", async (req, res) => {
    try {
        const workoutData = await Workout.find();
        if (workoutData) {
            Workout.aggregate([
                {
                    $addFields: {
                        totalDuration: {
                            $sum: "$exercises.duration",
                        }
                    },
                },
            ], (err, data) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(data);
                }
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/workouts/range", async (req, res) => {
    try {
        const workoutData = await Workout.find().limit(7);
        if (workoutData) {
            Workout.aggregate([
                {
                    $addFields: {
                        totalDuration: {
                            $sum: "$exercises.duration",
                        }
                    }
                }], (err, data) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.json(data);
                    }
                })
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/workouts", async (req, res) => {
    try {
        const workout = req.body;
        const newWorkout = await Workout.create({ exercises: workout });
        res.status(200).json(newWorkout);
    } catch (err) {
        res.status(500).json(err);
    }


});

router.put("/workouts/:id", async (req, res) => {
    try {
        const query = { _id: mongojs.ObjectId(req.params.id) };
        const workout = req.body;
        const updateWorkout = await Workout.updateOne(query, { $push: { exercises: workout }});
        res.status(200).json(updateWorkout);
    } catch (err) {
        res.status(500).json(err);
    }
    
});

module.exports = router;