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
export const MigrateDatabase = PubSubEvent.make<void>('migrate');
export const RepublishAllPrograms = PubSubEvent.make<PublishBlogPostEvent>('publishBlogPost', {
    userId: 'string',
    blogPostId: 'string'
})
```

**Sending events**
```typescript
async function triggerPublishPost(userId: string, postId: string) {
    const event = PublishProgram.create({
        userId, blogPostId: postId
    });
    return this.pubSubService.publishMessage(event);
}
```
