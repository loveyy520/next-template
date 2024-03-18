import { ChatBody, Conversation, Message } from "@/types/chat";
import { Plugin, PluginKey } from "@/types/plugin";
import { Dispatch, SetStateAction } from "react";

type SetConversationAction = Dispatch<SetStateAction<Conversation>>

function getUpdatedConversation(selectedConversation: Conversation, deleteCount: number, message: Message): Conversation {
    const end = selectedConversation.messages.length - deleteCount
    // [0, 1, 2]  len = 3, del 2 => [0], (0, 1)
    return {
      ...selectedConversation,
      messages: [...selectedConversation.messages.slice(0, end), message]
    }
}
  
function getStandardBody(plugin: Plugin | null, chatBody: ChatBody, pluginKeys: PluginKey[]) {
    const body = plugin
      ? {
        ...chatBody,
        googleAPIKey: pluginKeys
          .find((key) => key.pluginId === 'google-search')
          ?.requiredKeys.find((key) => key.key === 'GOOGLE_API_KEY')?.value,
        googleCSEId: pluginKeys
          .find((key) => key.pluginId === 'google-search')
          ?.requiredKeys.find((key) => key.key === 'GOOGLE_CSE_ID')?.value,
      }
      : chatBody
    return JSON.stringify(body);
  }
  
function updateCurrentConversation(setSelectedConversation: SetConversationAction, currentConversation: Conversation, updatedMessages: Message[]) {
    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages,
    };

    setSelectedConversation(updatedConversation);
  }
  
function updateStreamingConversation(setSelectedConversation: SetConversationAction, currentConversation: Conversation, text: string): void {
    const preMessages = currentConversation.messages

    currentConversation.messages = preMessages.map(
      (message, index) => index < preMessages.length - 1
        ? message
        : {
            ...message,
            content: text,
          }
    );
    
    updateCurrentConversation(setSelectedConversation,currentConversation, currentConversation.messages)
  }

export {
  getStandardBody, getUpdatedConversation, updateCurrentConversation,
  updateStreamingConversation
};

