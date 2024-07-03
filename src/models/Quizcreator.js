import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true
  }
});

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['MCQ', 'FillUp', 'Subjective'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  options: [OptionSchema],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: function() {
      return this.type !== 'Subjective';
    }
  },
  score: {
    type: Number,
    default: null
  }
}, { timestamps: true });

const QuizCreatorSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  grades: {
    type: Boolean,
    default: false,
    required: true
  },
  checkingType: {
    type: String,
    required: true
  },
  isTimed: {
    type: Boolean,
    default: false,
    required: true
  },
  timeframe: {
    type: String,
    required: function() {
      return this.isTimed === true;
    }
  },
  isPublished:{
    type: Boolean,
    default: false,
  },
  questions: [QuestionSchema]
}, { timestamps: true });

const QuizCreator = mongoose.models.QuizCreator || mongoose.model('QuizCreator', QuizCreatorSchema);

export default QuizCreator;
