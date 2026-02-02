import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalysis extends Document {
  userId: string;
  type: 'speech' | 'emotion' | 'posture';
  data: any;
  scenarioId?: number;
  scenarioTitle?: string;
  createdAt: Date;
}

const AnalysisSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true, enum: ['speech', 'emotion', 'posture'] },
  data: { type: Schema.Types.Mixed, required: true },
  scenarioId: { type: Number },
  scenarioTitle: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Analysis: Model<IAnalysis> = mongoose.models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);

export default Analysis;