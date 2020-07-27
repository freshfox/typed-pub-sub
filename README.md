# Typed PubSub Events

A lightweight wrapper for sending typed data using PubSub events
and parsing it in a Firebase function.

## Usage 
This library can be using with [Inversify](http://inversify.io/)

**Loading the module into the Inversify container**
```typescript
container.load(
    new PubSubModule({
        projectId: 'google-cloud-project-id'
    })
)
``` 

**Defining events**
```typescript
export interface PublishBlogPostEvent {
    userId: string;
    postId: string;
}

export const MigrateDatabase = PubSubEvent.make<void>('migrate');
export const PublishBlogPost = PubSubEvent.make<PublishBlogPostEvent>('publishBlogPost', {
    userId: 'string',
    postId: 'string'
})
```

**Sending events**
```typescript
async function triggerPublishPost(userId: string, postId: string) {
    const event = PublishProgram.create({
        userId, postId
    });
    return this.pubSubService.publishMessage(event);
}
```

**Register a Firebase function**
```typescript
export const publishBlogPost = createPubSubFunction(PublishBlogPost, (data) => {
	console.log(data.userId, data.postId);
});
```
