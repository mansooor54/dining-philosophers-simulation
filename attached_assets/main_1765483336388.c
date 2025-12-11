/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: malmarzo <malmarzo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/23 09:15:37 by malmarzo          #+#    #+#             */
/*   Updated: 2025/11/23 11:55:37 by malmarzo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/philo.h"

static void	join_threads(t_data *data, int count, pthread_t *monitor)
{
	int	i;

	if (monitor)
		pthread_join(*monitor, NULL);
	i = 0;
	while (i < count)
	{
		pthread_join(data->philos[i].thread, NULL);
		i++;
	}
}

static int	create_philo_threads(t_data *data)
{
	int	i;

	i = 0;
	while (i < data->num_philos)
	{
		data->philos[i].last_meal_time = data->start_time;
		if (pthread_create(&data->philos[i].thread, NULL,
				&philo_routine, &data->philos[i]))
		{
			pthread_mutex_lock(&data->dead_lock);
			data->dead_flag = 1;
			pthread_mutex_unlock(&data->dead_lock);
			join_threads(data, i, NULL);
			return (1);
		}
		i++;
	}
	return (0);
}

static int	start_simulation(t_data *data)
{
	pthread_t	monitor;
	int			philo_count;

	data->start_time = get_time() + (data->num_philos * 20);
	if (create_philo_threads(data))
		return (1);
	philo_count = data->num_philos;
	if (pthread_create(&monitor, NULL, &monitor_routine, data))
	{
		pthread_mutex_lock(&data->dead_lock);
		data->dead_flag = 1;
		pthread_mutex_unlock(&data->dead_lock);
		join_threads(data, philo_count, NULL);
		return (1);
	}
	join_threads(data, philo_count, &monitor);
	return (0);
}

static void	cleanup(t_data *data, int cleanup_level)
{
	int	i;

	if (cleanup_level >= 3)
	{
		pthread_mutex_lock(&data->dead_lock);
		data->dead_flag = 1;
		pthread_mutex_unlock(&data->dead_lock);
	}
	if (cleanup_level >= 2 && data->philos)
		free(data->philos);
	if (cleanup_level >= 1 && data->forks)
	{
		i = 0;
		while (i < data->num_philos)
		{
			pthread_mutex_destroy(&data->forks[i]);
			i++;
		}
		free(data->forks);
		pthread_mutex_destroy(&data->write_lock);
		pthread_mutex_destroy(&data->meal_lock);
		pthread_mutex_destroy(&data->dead_lock);
	}
}

int	main(int argc, char **argv)
{
	t_data	data;

	if (argc < 5 || argc > 6)
	{
		printf("Usage: ./philo <number_of_philosophers> <time_to_die> ");
		printf("<time_to_eat> <time_to_sleep> [must_eat]\n");
		return (1);
	}
	if (check_args(argc, argv) || init_data(&data, argc, argv))
		return (1);
	if (data.must_eat_count == 0)
		return (0);
	if (init_mutexes(&data) || init_philos(&data))
		return (cleanup(&data, 1), 1);
	if (start_simulation(&data))
		return (cleanup(&data, 2), 1);
	return (cleanup(&data, 2), 0);
}
