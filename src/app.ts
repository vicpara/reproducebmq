import { Worker, Job, FlowProducer } from 'bullmq'

const BQueue = {
  primaryQueueName:'primary',
  secondaryQueueName:'secondary'
}

const connectionOpts = {
  host: "localhost",
  port: 6379
}


const flow = {
  name: 'parentJob',
  queueName: BQueue.primaryQueueName,
  data: { foo: 'bar' },
  opts: {},
  children: [
    {
      name: 'childJob1',
      queueName: BQueue.primaryQueueName,
      data: { foo: 'child1' },
      opts: {},
      children: [],
    },
    {
      name: 'childJob2',
      queueName: BQueue.primaryQueueName,
      data: { foo: 'child2' },
      opts: {},
      children: [
        {
          name: 'childJob2/finalJob2',
          queueName: BQueue.primaryQueueName,
          data: { foo: 'final' },
          opts: {},
        },
        {
          name: 'childJob2/finalJob1',
          queueName: BQueue.primaryQueueName,
          data: { foo: 'final' },
          opts: {},
          children: [
            {
              name: 'childJob2/finalJob/final',
              queueName: BQueue.primaryQueueName,
              data: { foo: 'final/final' },
              opts: {},
            },
          ],
        },
      ],
    },
    {
      name: 'childJob3',
      queueName: BQueue.primaryQueueName,
      data: { foo: 'child3' },
      opts: {},
    },
  ],
}


const flowProducer = new FlowProducer({ connection: connectionOpts })
const pn = flowProducer.add(flow)
console.log('Created flow', pn)

async function transform(job: Job) {
  console.log(job.name)

  return job.name
}


new Worker(BQueue.primaryQueueName, transform , {
  concurrency: 1,
  connection: connectionOpts,
})