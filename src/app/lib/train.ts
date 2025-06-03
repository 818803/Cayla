// chat/train.ts
import { trainModel, trainingData, ChatbotModel } from '../lib/training';

let trainedModel: ChatbotModel | null = null;

export function initializeBot(): ChatbotModel {
  if (!trainedModel) {
    console.log('Training chatbot...');
    trainedModel = trainModel(trainingData);
    console.log('Chatbot trained successfully!');
  }
  return trainedModel;
}

export function getTrainedModel(): ChatbotModel | null {
  return trainedModel;
}

export function retrainBot(newData?: any[]): ChatbotModel {
  const dataToUse = newData || trainingData;
  console.log('Retraining chatbot...');
  trainedModel = trainModel(dataToUse);
  console.log('Chatbot retrained successfully!');
  return trainedModel;
}

// Auto-initialize on import
initializeBot();