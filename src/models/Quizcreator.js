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
    type: String
  },
  isTimed:{
    type: Boolean,
    default: false,
    required: true
  },
  startTime:{
    type: Date,
    default: null,
  },
  endTime:{
    type: Date,
    default: null,
  },
  isPublished:{
    type: Boolean,
    default: false,
  },
  totalScore:{
    type: Number,
    default: null,
  },
  questions: [QuestionSchema]
}, { timestamps: true });

QuizCreatorSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalScore = this.questions.reduce((acc, question) => acc + question.score, 0);
  } else {
    this.totalScore = 0;
  }
  next();
});

const QuizCreator = mongoose.models.QuizCreator || mongoose.model('QuizCreator', QuizCreatorSchema);

export default QuizCreator;
