const mongoose = require("mongoose");

const levelMasterySchema = new mongoose.Schema(
  {
    known: {
      type: Number,
      default: 0,
      min: 0
    },
    answered: {
      type: Number,
      default: 0,
      min: 0
    },
    score: {
      type: Number,
      default: 0,
      min: 0
    },
    maxScore: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    _id: false
  }
);

const userStatsSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      default: 0,
      min: 0
    },
    testsTaken: {
      type: Number,
      default: 0,
      min: 0
    },
    knownWords: {
      type: Number,
      default: 0,
      min: 0
    },
    correctAnswers: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAnswers: {
      type: Number,
      default: 0,
      min: 0
    },
    streak: {
      type: Number,
      default: 0,
      min: 0
    },
    lastActiveDate: {
      type: Date,
      default: null
    },
    levelMastery: {
      A1: {
        type: levelMasterySchema,
        default: () => ({})
      },
      A2: {
        type: levelMasterySchema,
        default: () => ({})
      },
      B1: {
        type: levelMasterySchema,
        default: () => ({})
      },
      B2: {
        type: levelMasterySchema,
        default: () => ({})
      },
      C1: {
        type: levelMasterySchema,
        default: () => ({})
      },
      C2: {
        type: levelMasterySchema,
        default: () => ({})
      }
    }
  },
  {
    _id: false
  }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    stats: {
      type: userStatsSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true
  }
);

userSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
